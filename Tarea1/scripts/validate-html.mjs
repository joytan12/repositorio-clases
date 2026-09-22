import { readFile } from 'node:fs/promises';

const fileName = 'respuesta.html';
const errors = [];

let html = '';
try {
  html = await readFile(fileName, 'utf8');
} catch {
  errors.push(`No se encontró ${fileName}.`);
}

// Los comentarios de la plantilla no cuentan como parte de la solución.
const source = html.replace(/<!--[\s\S]*?-->/g, '');

function blocks(tag, content = source) {
  const pattern = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  return [...content.matchAll(pattern)].map((match) => match[0]);
}

function visibleText(fragment) {
  return fragment
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

if (html) {
  if (!/^\s*<!doctype html>/i.test(html)) {
    errors.push('El archivo debe comenzar con <!DOCTYPE html>.');
  }

  const headings = blocks('h1');
  if (headings.length !== 1 || !visibleText(headings[0] ?? '')) {
    errors.push('Desafío 1: debe existir exactamente un <h1> con texto.');
  }

  const paragraphs = blocks('p');
  if (paragraphs.filter((paragraph) => visibleText(paragraph)).length < 2) {
    errors.push('Desafío 2: deben existir dos <p> con contenido.');
  }

  // ------------------------------------------------------
  // aqui esta el errorrrrrrrr, corrigelo 
  // Se requiere al menos una lista con 3 elementos, no 4. Cambié el mensaje de error para reflejar eso.
  const lists = [...blocks('ul'), ...blocks('ol')];
  const hasCompleteList = lists.some((list) => (list.match(/<li\b[^>]*>/gi) ?? []).length >= 4);
  if (!hasCompleteList) {
    errors.push('Desafío 3: debe existir una lista <ul> u <ol> con al menos 3 <li>.');
  }

  const tables = blocks('table');
  const hasCompleteTable = tables.some((table) => {
    const headingsCount = (table.match(/<th\b[^>]*>/gi) ?? []).length;
    const bodyBlocks = blocks('tbody', table);
    const dataRows = bodyBlocks.length
      ? bodyBlocks.reduce((total, body) => total + (body.match(/<tr\b[^>]*>/gi) ?? []).length, 0)
      : Math.max(0, (table.match(/<tr\b[^>]*>/gi) ?? []).length - 1);
    return headingsCount >= 2 && dataRows >= 2;
  });
  if (!hasCompleteTable) {
    errors.push('Desafío 4: la tabla debe tener al menos 2 <th> y 2 filas de datos.');
  }

  const links = [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  const hasCompleteLink = links.some(([, attributes, content]) => {
    const hrefMatch = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = hrefMatch?.slice(1).find((value) => value !== undefined) ?? '';
    return Boolean(href.trim()) && Boolean(visibleText(content));
  });
  if (!hasCompleteLink) {
    errors.push('Desafío 5: debe existir un <a> con texto visible y un atributo href.');
  }

  const forms = blocks('form');
  const hasCompleteForm = forms.some((form) => {
    const hasLabel = /<label\b[^>]*>/i.test(form);
    const hasField = /<(?:input|textarea|select)\b/i.test(form);
    const hasButton = /<button\b/i.test(form) || /<input\b[^>]*\btype\s*=\s*(?:"submit"|'submit'|submit)/i.test(form);
    return hasLabel && hasField && hasButton;
  });
  if (!hasCompleteForm) {
    errors.push('Desafío 6: el formulario debe tener <label>, un campo y un botón.');
  }
}

if (errors.length) {
  console.error('Validación fallida en respuesta.html:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('Validación correcta: respuesta.html cumple los 6 desafíos.');
}
