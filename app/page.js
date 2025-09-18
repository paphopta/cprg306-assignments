import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main>
        <p>CPRG 306: Web Development 2 - Assignments</p>
        <p><Link href="./week-2">Go to Week 2</Link> → <Link href="./week-3">Go to Week 3</Link></p>
      </main>
    </div>
  );
}