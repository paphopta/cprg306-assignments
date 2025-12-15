"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";

export default function ProjectPage() {
  const router = useRouter();

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/project/login');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push('/project/task');
    } else {
      router.push('/project/login');
    }
  };

  useEffect(() => {
    checkUser();
  }, [router]);

  return null;
}