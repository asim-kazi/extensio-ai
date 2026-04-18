import { useState } from 'react';
import api from '../services/api';

export default function Sidebar({ projects, setProjects, user }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this extension?')) return;
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setActiveMenu(null);
  };

  const handleRename = async (id, oldName) => {
    const newName = prompt('Enter new name:', oldName);
    if (!newName || newName === oldName) return;

    try {
      await api.put(`/projects/${id}`, { name: newName });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: newName } : p)),
      );
    } catch (e) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: newName } : p)),
      );
    }
    setActiveMenu(null);
  };

  return (
    <div className="w-[280px] h-full bg-[#111520] text-slate-300 p-4 border-r border-slate-800/80 flex flex-col shrink-0 z-10">
      {user ? (
        <>
          <h3 className="text-xs uppercase text-slate-500 tracking-wider font-bold mb-4 px-2 mt-2">
            History
          </h3>

          <div className="flex flex-col overflow-y-auto flex-1 space-y-1">
            {projects.length === 0 ? (
              <p className="text-slate-600 text-sm italic px-2">
                No extensions yet.
              </p>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="group relative px-3 py-3 rounded-lg transition-colors duration-200 flex justify-between items-center cursor-pointer hover:bg-slate-800/80 text-slate-300 hover:text-white"
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <span className="text-[14.5px] whitespace-nowrap overflow-hidden text-ellipsis flex-1 font-medium mr-2">
                    {p.name}
                  </span>

                  <div className="relative flex-shrink-0">
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-transparent text-slate-400 hover:text-white p-1 rounded-md text-lg flex items-center justify-center w-7 h-7"
                      onClick={() =>
                        setActiveMenu(activeMenu === p.id ? null : p.id)
                      }
                    >
                      ⋮
                    </button>

                    {activeMenu === p.id && (
                      <div className="absolute right-0 top-8 bg-[#1e2333] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-30 w-[130px] animate-pop-in">
                        <button
                          className="block w-full px-4 py-2.5 bg-transparent text-slate-300 text-left cursor-pointer text-sm font-medium hover:bg-slate-700"
                          onClick={() => handleRename(p.id, p.name)}
                        >
                          ✏️ Rename
                        </button>
                        <button
                          className="block w-full px-4 py-2.5 bg-transparent text-red-400 text-left cursor-pointer text-sm font-medium hover:bg-slate-700"
                          onClick={() => handleDelete(p.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-slate-800/30 p-5 rounded-xl text-center border border-slate-800 mt-4">
          <p className="m-0 text-sm text-slate-400">
            Sign in to save and view your extension history.
          </p>
        </div>
      )}
    </div>
  );
}
