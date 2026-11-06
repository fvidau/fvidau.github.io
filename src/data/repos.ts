// Repos públicos de GitHub para la página de Proyectos. Se consultan al construir el sitio.
export interface Repo {
  nombre: string;
  descripcion: string | null;
  lenguaje: string | null;
  actualizado: string;
  url: string;
}

interface RepoGitHub {
  name: string;
  description: string | null;
  language: string | null;
  pushed_at: string;
  html_url: string;
  fork: boolean;
  archived: boolean;
}

// Falla en vez de devolver una lista vacía: mejor no publicar que publicar Proyectos sin tarjetas.
export async function obtenerRepos(usuario: string, token?: string): Promise<Repo[]> {
  const respuesta = await fetch(`https://api.github.com/users/${usuario}/repos?per_page=100`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!respuesta.ok) {
    throw new Error(`La API de GitHub respondió ${respuesta.status} al pedir los repos de ${usuario}`);
  }

  const repos = ((await respuesta.json()) as RepoGitHub[])
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
    .map((r) => ({
      nombre: r.name,
      descripcion: r.description,
      lenguaje: r.language,
      actualizado: r.pushed_at,
      url: r.html_url,
    }));

  if (repos.length === 0) {
    throw new Error(`GitHub no devolvió repos públicos de ${usuario}`);
  }
  return repos;
}
