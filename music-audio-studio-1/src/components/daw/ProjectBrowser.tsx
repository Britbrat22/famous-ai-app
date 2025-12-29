import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Trash2, Clock, Music, Plus, Loader2 } from 'lucide-react';
import { listProjects, deleteProject } from '@/lib/projectService';

interface Project {
  id: string;
  name: string;
  updatedAt: Date;
}

interface ProjectBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
}

export const ProjectBrowser: React.FC<ProjectBrowserProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onNewProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setIsLoading(true);
    const result = await listProjects();
    if (result.success && result.projects) {
      setProjects(result.projects);
    }
    setIsLoading(false);
  };

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(projectId);
    
    const result = await deleteProject(projectId);
    if (result.success) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
    
    setDeletingId(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2d2d2d] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-lg font-semibold text-white">Your Projects</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {/* New project button */}
          <button
            onClick={onNewProject}
            className="w-full mb-4 p-4 rounded-xl border-2 border-dashed border-[#3a3a3a] hover:border-[#00d4ff] text-gray-400 hover:text-[#00d4ff] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Project</span>
          </button>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#00d4ff] animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No projects yet</p>
              <p className="text-gray-500 text-sm">Create your first project to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="w-full p-4 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#b24bf3]/20 to-[#00d4ff]/20 flex items-center justify-center">
                      <Music className="w-5 h-5 text-[#b24bf3]" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{project.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-2"
                  >
                    {deletingId === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3a3a3a] bg-[#252525]">
          <p className="text-xs text-gray-500 text-center">
            Projects are automatically saved to the cloud
          </p>
        </div>
      </div>
    </div>
  );
};
