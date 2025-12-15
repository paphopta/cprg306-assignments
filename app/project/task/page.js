"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTask, setSelectedTask] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  /* Load tasks from Supabase */
  async function fetchTasks() {
    const { data, error } = await supabase
      .from("cprg306_task")
      .select(`id, 
        task_name,
        group,
        description,
        priority_id,
        status_id,
        cprg306_priority (
          priority_id,
          description
        ),
        cprg306_status (
          status_id,
          description
        ),
        planned_start_date,
        planned_end_date,
        actual_start_date,
        actual_end_date,
        actual_progress
      `);

    const sortedData = data.sort((a, b) => {
      const groupCompare = a.group.localeCompare(b.group);
      if (groupCompare !== 0) return groupCompare;
      return a.task_name.localeCompare(b.task_name);
    });

    /* Get unique group for group filter button */
    const uniqueGroups = [...new Set(sortedData.map(task => task.group))].sort();
    setGroups(uniqueGroups);

    /* Calculate some columns from column from database */
    const addCalculatedData = sortedData.map(task => {
      let plannedProgress = 0;
      let scheduleDeviation = 0;

      /* Fix timezone problem */
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const plannedStartDate = new Date(task.planned_start_date);
      plannedStartDate.setHours(0, 0, 0, 0);
      plannedStartDate.setDate(plannedStartDate.getDate() + 1); 

      const plannedEndDate = new Date(task.planned_end_date);
      plannedEndDate.setHours(0, 0, 0, 0);
      plannedEndDate.setDate(plannedEndDate.getDate() + 1); 

      const MS_PER_DAY = 1000 * 60 * 60 * 24;

      /* Calculate schedule deviation */
      if (task.actual_end_date) {
        const actualEndDate = new Date(task.actual_end_date);
        actualEndDate.setHours(0, 0, 0, 0);
        actualEndDate.setDate(actualEndDate.getDate() + 1); 

        scheduleDeviation = Math.round(((actualEndDate - plannedEndDate) / MS_PER_DAY) * 100 / (((plannedEndDate - plannedStartDate) / MS_PER_DAY) + 1 ));
      } else {
        if (today > plannedEndDate) {
          scheduleDeviation = Math.round(((today - plannedEndDate) / MS_PER_DAY) * 100 / (((plannedEndDate - plannedStartDate) / MS_PER_DAY) + 1 ));
        }
        else{
          scheduleDeviation = 0;
        }
      }

      /* Calculate planned progress */
      if (today >= plannedEndDate) {
        plannedProgress = 100;
      } else if (today < plannedStartDate) {
        plannedProgress = 0;
      } else {
        plannedProgress = Math.round(((today - plannedStartDate + 1) / (plannedEndDate - plannedStartDate + 1)) * 100);
      }
      return {...task, schedule_deviation: scheduleDeviation, planned_progress: plannedProgress};
    });
  
    if (error) {
      alert(error.message);
    } else {
      setTasks(addCalculatedData);
    }
  }

  /* Get priority for modal */
  async function fetchPriorities() {
    const { data, error } = await supabase
      .from("cprg306_priority")
      .select("priority_id, description")
      .order("priority_id");

    if (error) {
      alert(error.message);
    } else {
      setPriorities(data);
    }
  }

  /* Get status for modal */
  async function fetchStatuses() {
    const { data, error } = await supabase
      .from("cprg306_status")
      .select("status_id, description")
      .order("status_id");

    if (error) {
      alert(error.message);
    } else {
      setStatuses(data);
    }
  }

  /* Add/update process */
  async function handleSubmitTask() {

    /* Check inputs */
    if (selectedTask.task_name === ""){
      alert("Please fill task name");
      return;
    }
    if (selectedTask.group === ""){
      alert("Please fill group");
      return;
    }
    if (selectedTask.planned_start_date === ""){
      alert("Please select planned start date");
      return;
    }
    if (selectedTask.planned_end_date === ""){
      alert("Please select planned end date");
      return;
    }
    const plannedStartDate = new Date(selectedTask.planned_start_date);
    const plannedEndDate = new Date(selectedTask.planned_end_date);
    if (plannedEndDate < plannedStartDate) {
      alert("Planned end date must not be earlier than planned start date");
      return;
    }
    if (selectedTask.actual_start_date && selectedTask.actual_end_date) {
      const actualStartDate = new Date(selectedTask.actual_start_date);
      const actualEndDate = new Date(selectedTask.actual_end_date);
      if (actualEndDate < actualStartDate) {
        alert("Actual end date must not be earlier than actual start date");
        return;
      }
    }
    if (selectedTask.actual_progress !== "") {
      const progress = Number(selectedTask.actual_progress);
      if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
        alert("Actual progress must be an integer between 0 and 100");
        return;
      }
    }

    if (modalMode === "add") {
      const { data, error } = await supabase
        .from("cprg306_task")
        .insert([{
          task_name: selectedTask.task_name,
          group: selectedTask.group,
          description: selectedTask.description,
          priority_id: Number(selectedTask.priority_id),
          status_id: Number(selectedTask.status_id),
          planned_start_date: selectedTask.planned_start_date || null,
          planned_end_date: selectedTask.planned_end_date || null,
          actual_start_date: selectedTask.actual_start_date || null,
          actual_end_date: selectedTask.actual_end_date || null,
          actual_progress: Number(selectedTask.actual_progress) || 0
        }]);

      if (error) {
        alert(error.message);
      } else {
        fetchTasks();
      }
    } else {
      const { data, error } = await supabase
        .from("cprg306_task")
        .update([{
          task_name: selectedTask.task_name,
          group: selectedTask.group,
          description: selectedTask.description,
          priority_id: Number(selectedTask.priority_id),
          status_id: Number(selectedTask.status_id),
          planned_start_date: selectedTask.planned_start_date || null,
          planned_end_date: selectedTask.planned_end_date || null,
          actual_start_date: selectedTask.actual_start_date || null,
          actual_end_date: selectedTask.actual_end_date || null,
          actual_progress: Number(selectedTask.actual_progress) || 0
        }])
        .eq("id", selectedTask.id)
        .select();

      if (error) {
        alert(error.message);
      } else {
        fetchTasks();
      }
    }

    setIsModalOpen(false);
    fetchTasks();
  }

  /* Delete task in supabase */
  async function deleteTask(taskId) {
    const { error } = await supabase
      .from("cprg306_task")
      .delete()
      .eq("id", taskId);
      
    if (error) {
      alert(error.message);
      return;
    }
    fetchTasks();
  }

  /* Check log in? */
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  useEffect(() => {
    getUser();
    fetchTasks();
    fetchPriorities();
    fetchStatuses();
  }, []);

  /* Filter tasks by group filter button */
  const filterTasks = (keyword, group) => {
    const stringKeyword = (keyword || "").toString().toLowerCase(); 
    const filtered = tasks.filter(task => {
      const matchesKeyword = task.task_name
        .toLowerCase()
        .includes(stringKeyword.toLowerCase());
      const matchesGroup = group ? task.group === group : true;
      return matchesKeyword && matchesGroup;
    });
    setFilteredTasks(filtered);
  };

  /* Log out */
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    router.replace('/project/login');
  };

  return (
    <div className="w-full bg-black flex items-center justify-center min-h-full p-2">
      <div className="container max-w-full">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

           {/* Header text, logout and add buttons */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Task Management</h2>
                <p className="text-gray-500 mt-1">Manage tasks and add new task here.</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-2">
                {!user && ( <button
                  onClick={() => router.push('/project/login')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 mx-2 rounded-lg transition duration-150 ease-in-out"
                >
                  Log in
                </button>)}
                {user && ( <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 mx-2 rounded-lg transition duration-150 ease-in-out"
                >
                  Logout
                </button>)}
                <button 
                  onClick={() => {
                    setModalMode("add");
                    setSelectedTask({
                      task_name: "",
                      group: "",
                      description: "",
                      priority_id: 2,
                      status_id: 1,
                      planned_start_date: new Date().toISOString().slice(0, 10),
                      planned_end_date: new Date().toISOString().slice(0, 10),
                      actual_start_date: "",
                      actual_end_date: "",
                      actual_progress: "0"
                    });
                    setIsModalOpen(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                  Add Task
                </button>
              </div>
            </div>

           {/* Search input and group filter button */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  🔍
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Search tasks..."
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                    filterTasks(event.target.value, selectedGroup);
                  }}
                  onKeyDown={filterTasks}
                />
              </div>
              <div>
                <select 
                  value={selectedGroup}
                  onChange={(event) => {
                      const group = event.target.value;
                      setSelectedGroup(group);
                      filterTasks(searchKeyword, group);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto h-10"
                >
                  <option value="">All Groups</option>
                  {groups.map(group => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

         {/* Main table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">

              {/* Table header */}
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Name
                  </th>
                  <th scope="col" className="w-[150px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th scope="col" className="w-[100px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="w-[120px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="w-[120px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planned <br/>Start Date
                  </th>
                  <th scope="col" className="w-[120px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planned <br/>End Date
                  </th>
                  <th scope="col" className="w-[120px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual <br/>Start Date
                  </th>
                  <th scope="col" className="w-[120px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual <br/>End Date
                  </th>
                  <th scope="col" className="w-[100px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule <br/>Deviation
                  </th>
                  <th scope="col" className="w-[150px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planned <br/>Progress
                  </th>
                  <th scope="col" className="w-[150px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual <br/>Progress
                  </th>
                  <th scope="col" className="w-[120px] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Row of data */}
              <tbody className="bg-white divide-y divide-gray-200">
                {(searchKeyword || selectedGroup != "" ? filteredTasks : tasks).map((tasks) => (
                <tr key={tasks.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {tasks.task_name}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {tasks.group}
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-center">
                    <span className={`inline-block w-20 rounded-full px-2 py-0.5 text-sm text-center ${
                      tasks.priority_id === 1
                        ? "bg-green-100 text-green-600 border border-green-600"
                        : tasks.priority_id === 2
                        ? "bg-yellow-100 text-yellow-600 border border-yellow-600"
                        : tasks.priority_id === 3
                        ? "bg-red-100 text-red-600 border border-red-600"
                        : "bg-gray-100 text-gray-600 border border-gray-600"
                        }`}
                      >
                      {tasks.priority_id >= 1 || tasks.priority_id <= 3
                      ? tasks.cprg306_priority.description
                      : "Unknown"}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-center">
                    <span className={`inline-block w-25 rounded-full px-2 py-0.5 text-sm text-center ${
                      tasks.status_id === 1
                        ? "bg-gray-100 text-gray-600 border border-gray-600"
                        : tasks.status_id === 2
                        ? "bg-blue-100 text-blue-600 border border-blue-600"
                        : tasks.status_id === 3
                        ? "bg-green-100 text-green-600 border border-green-600"
                        : tasks.status_id === 4
                        ? "bg-violet-100 text-violet-600 border border-violet-600"
                        : tasks.status_id === 5
                        ? "bg-stone-400 text-stone-900 border border-stone-600"
                        : "bg-stone-100 text-stone-600 border border-stone-600"
                        }`}
                      >
                      {tasks.status_id >= 1 || tasks.status_id <= 5
                      ? tasks.cprg306_status.description
                      : "Unknown"}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-center text-gray-900">
                      {tasks.planned_start_date}
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-center text-gray-900">
                      {tasks.planned_end_date}
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-center text-gray-900">
                      {tasks.actual_start_date}
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-center text-gray-900">
                      {tasks.actual_end_date}
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-center text-gray-900">
                      {tasks.schedule_deviation}%
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap relative">
                    <div className="w-full h-6 bg-gray-400 rounded-full">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${tasks.planned_progress}%` }}>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
                        {tasks.planned_progress}%
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap relative">
                    <div className={`w-full h-6 rounded-full ${tasks.planned_progress - tasks.actual_progress >= 30? "bg-red-600": "bg-gray-400"}`}>
                      <div className="h-full bg-green-600 rounded-full" style={{ width: `${tasks.actual_progress}%` }}>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
                        {tasks.actual_progress}%
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-center">
                    <button 
                      className="border border-blue-500 bg-blue-500 text-white text-xs rounded-md px-1 py-1 m-1 transition duration-500 ease select-none hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        setModalMode("update");
                        setSelectedTask({
                          ...tasks,
                          task_name: tasks.task_name || "",
                          group: tasks.group || "",
                          description: tasks.description || "",
                          planned_start_date: tasks.planned_start_date || "",
                          planned_end_date: tasks.planned_end_date || "",
                          actual_start_date: tasks.actual_start_date || "",
                          actual_end_date: tasks.actual_start_date || "",
                          actual_progress: tasks.actual_progress || ""
                        });
                        setIsModalOpen(true);
                    }}>
                      Update
                    </button>
                    <button 
                      className="border border-red-500 bg-red-500 text-white text-xs rounded-md px-1 py-1 m-1 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this task?")) {
                          deleteTask(tasks.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal for add or update task */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative flex flex-col max-h-[90vh]">

            {/* Modal header */}
            <div className="p-2 mt-4">
              <div className="pb-2 text-center dark:text-white">
                <h2 className="text-xl font-bold tracking-tight" id="page-action.heading">
                  {modalMode === "add" ? "Add Task" : "Update Task"}
                </h2>
              </div>
            </div>
            <div aria-hidden="true" className="border-t border-gray-700 w-full"></div>

            {/* Modal body */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 px-4 py-2 w-full">
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Task Name</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder="Task Name"
                    value={selectedTask?.task_name || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, task_name: event.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Group</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder="Group"
                    value={selectedTask?.group || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, group: event.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Description</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder="Description"
                    value={selectedTask?.description || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, description: event.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Priority</label>
                  <select
                    className="border p-2 shadow-md border-gray-700 focus:outline-none ease-in-out duration-300 rounded-lg w-full bg-white"
                    value={selectedTask?.priority_id || ""}
                    onChange={(event) => setSelectedTask({...selectedTask, priority_id: Number(event.target.value)})}
                  >
                    <option value="" disabled>Select Priority</option>
                    {priorities.map((priority) => (
                       <option key={priority.priority_id} value={priority.priority_id}>{priority.description}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Status</label>
                  <select
                    className="border p-2 shadow-md border-gray-700 focus:outline-none ease-in-out duration-300 rounded-lg w-full bg-white"
                    value={selectedTask?.status_id || ""}
                    onChange={(event) => setSelectedTask({...selectedTask, status_id: Number(event.target.value)})}
                  >
                    <option value="" disabled>Select Status</option>
                    {statuses.map((status) => (
                       <option key={status.status_id} value={status.status_id}>{status.description}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Planned Start Date</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="date"
                    placeholder="Planned Start Date"
                    value={selectedTask?.planned_start_date || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, planned_start_date: event.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Planned End Date</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="date"
                    placeholder="Planned End Date"
                    value={selectedTask?.planned_end_date || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, planned_end_date: event.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Actual Start Date</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="date"
                    placeholder="Actual Start Date"
                    value={selectedTask?.actual_start_date || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, actual_start_date: event.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Actual End Date</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="date"
                    placeholder="Actual End Date"
                    value={selectedTask?.actual_end_date || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, actual_end_date: event.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mt-2 mb-2 text-gray-400 text-base">Actual Progress (%)</label>
                  <input
                    className="border p-2 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder="Actual Progress (%)"
                    value={selectedTask?.actual_progress || ""}
                    onChange={(event) =>setSelectedTask({ ...selectedTask, actual_progress: event.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div aria-hidden="true" className="border-t border-gray-700 w-full"></div>
            <div className="my-6 grid grid-cols-2 gap-4 w-full px-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSubmitTask(selectedTask);
                }}
                className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {modalMode === "add" ? "Add Task" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}