// Public access to StudyBFA; no password or access cookie required.
export async function onRequest(context) {
  return context.next();
}
