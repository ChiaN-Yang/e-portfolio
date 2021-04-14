import { experiencesRequest as req } from './https'

export const getExperiences = () => {
  return req.get('/')
}

export const getExperience = async (experienceId) => {
  return req.get(`/${experienceId}`)
}

export const addExperience = (data) => {
  return req.post('/', data)
}

export const updateExperience = async (experienceId, data) => {
  return req.put(`/${experienceId}`, data)
}

export const deleteExperience = async (experienceId) => {
  return req.delete(`/${experienceId}`)
}

export const getExperienceTags = async (experienceId) => {
  return req.get(`/${experienceId}/Tags`)
}
