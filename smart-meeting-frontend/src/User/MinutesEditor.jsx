export const MinutesEditor = () => (
  <section className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Minutes of Meeting</h2>
    <form className="space-y-4">
      <textarea className="w-full border rounded p-2" placeholder="Agenda Items..." rows={3}></textarea>
      <textarea className="w-full border rounded p-2" placeholder="Discussion & Decisions..." rows={4}></textarea>
      <input type="file" className="w-full" />
      <div className="flex gap-4">
        <button type="button" className="bg-yellow-500 text-white px-4 py-2 rounded">Save Draft</button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Finalize & Share</button>
      </div>
    </form>
  </section>
);