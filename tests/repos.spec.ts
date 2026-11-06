import { test, expect } from '@playwright/test';
import { obtenerRepos } from '../src/data/repos';

// Test unitario, sin navegador: se reemplaza fetch para simular a la API de GitHub.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'no usa navegador, alcanza con un proyecto');
});

const original = globalThis.fetch;
let pedidos: { url: string; headers: Record<string, string> }[] = [];

function responder(status: number, cuerpo: unknown) {
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    pedidos.push({ url: String(url), headers: (init?.headers ?? {}) as Record<string, string> });
    return new Response(JSON.stringify(cuerpo), { status });
  }) as typeof fetch;
}

function repo(nombre: string, extra: Record<string, unknown> = {}) {
  return {
    name: nombre,
    description: `Descripción de ${nombre}`,
    language: 'TypeScript',
    pushed_at: '2026-01-01T00:00:00Z',
    html_url: `https://github.com/fvidau/${nombre}`,
    fork: false,
    archived: false,
    ...extra,
  };
}

test.afterEach(() => {
  globalThis.fetch = original;
  pedidos = [];
});

test('si GitHub responde un error, falla nombrando el status', async () => {
  responder(403, { message: 'API rate limit exceeded' });
  await expect(obtenerRepos('fvidau')).rejects.toThrow(/403/);
});

test('si no hay repos, falla en vez de devolver una lista vacía', async () => {
  responder(200, []);
  await expect(obtenerRepos('fvidau')).rejects.toThrow();
});

test('descarta forks y archivados y ordena del push más reciente al más viejo', async () => {
  responder(200, [
    repo('viejo', { pushed_at: '2025-03-01T00:00:00Z' }),
    repo('un-fork', { fork: true }),
    repo('archivado', { archived: true }),
    repo('nuevo', { pushed_at: '2026-10-01T00:00:00Z' }),
  ]);
  const repos = await obtenerRepos('fvidau');
  expect(repos.map((r) => r.nombre)).toEqual(['nuevo', 'viejo']);
  expect(repos[0]).toEqual({
    nombre: 'nuevo',
    descripcion: 'Descripción de nuevo',
    lenguaje: 'TypeScript',
    actualizado: '2026-10-01T00:00:00Z',
    url: 'https://github.com/fvidau/nuevo',
  });
  expect(pedidos[0].url).toBe('https://api.github.com/users/fvidau/repos?per_page=100');
});

test('un repo sin descripción ni lenguaje los devuelve como null', async () => {
  responder(200, [repo('pelado', { description: null, language: null })]);
  const [unico] = await obtenerRepos('fvidau');
  expect(unico.descripcion).toBeNull();
  expect(unico.lenguaje).toBeNull();
});

test('manda el token solo si existe', async () => {
  responder(200, [repo('a')]);
  await obtenerRepos('fvidau', 'abc123');
  await obtenerRepos('fvidau');
  expect(pedidos[0].headers.Authorization).toBe('Bearer abc123');
  expect(pedidos[1].headers.Authorization).toBeUndefined();
});
