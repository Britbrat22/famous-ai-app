import { supabase } from './supabase';
import { Project, Track } from '@/types/daw';

export async function saveProject(project: Project): Promise<{ success: boolean; id?: string; error?: string }> {
  const { data, error } = await supabase
    .from('projects')
    .upsert({
      id: project.id,
      name: project.name,
      bpm: project.bpm,
      time_signature: project.timeSignature,
      tracks: project.tracks,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}

export async function loadProject(projectId: string): Promise<{ success: boolean; project?: Project; error?: string }> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  const project: Project = {
    id: data.id,
    name: data.name,
    bpm: data.bpm,
    timeSignature: data.time_signature,
    tracks: data.tracks as Track[],
    duration: 180,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };

  return { success: true, project };
}

export async function listProjects(): Promise<{ success: boolean; projects?: { id: string; name: string; updatedAt: Date }[]; error?: string }> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  const projects = data.map(p => ({
    id: p.id,
    name: p.name,
    updatedAt: new Date(p.updated_at),
  }));

  return { success: true, projects };
}

export async function deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function uploadAudioFile(
  file: File,
  projectId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const fileName = `${projectId}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from('audio-files')
    .getPublicUrl(data.path);

  return { success: true, url: urlData.publicUrl };
}
