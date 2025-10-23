import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main>
        <p>CPRG 306: Web Development 2 - Assignments</p>
        <p><Link href="./week-2">Go to Week 2</Link> → <Link href="./week-3">Go to Week 3</Link> → <Link href="./week-4">Go to Week 4</Link> → <Link href="./week-5">Go to Week 5</Link> → <Link href="./week-6">Go to Week 6</Link> → <Link href="./week-7">Go to Week 7</Link>→ <Link href="./week-8">Go to Week 8</Link></p>
      </main>
    </div>
  );
}