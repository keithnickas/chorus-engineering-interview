import { type Profile } from "../types/api";
import { request } from "../handle-response";
import { UUID } from "node:crypto";

/**
 * GET `/api/profile`
 * Returns all profiles (with their teams).
 */
export async function fetchAllProfiles(): Promise<Profile[]> {
  return request<Profile[]>('/profile');
}
 
/**
 * POST `/api/profile`
 * Creates a new profile with the given name.
 */
export async function createProfile(name: string): Promise<Profile> {
  return request<Profile>('/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}

/**
 * DELETE `/api/profile/:id`
 * Deletes a profile by id.
 */
export async function deleteProfile(profileId: UUID): Promise<void> {
  return request<void>(`/profile/${profileId}`, { method: 'DELETE' });
}
