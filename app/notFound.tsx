import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="w-full min-h-screen bg-zinc-50 flex justify-center items-center text-zinc-700">
      <h1>404</h1>
      <p>Lo siento, no se encontro la pagina que estas buscando</p>
      <Link href={"/"}>Regresar</Link>
    </div>
  );
}

export default NotFoundPage;
