import {
  getExperiences as getExperiencesAPI,
  addExperience as addExperienceAPI,
  updateExperience as updateExperienceAPI
} from '@/api/experiences'
import { sortExperiences, classifySemester } from '@/helpers/index'
const experiences = {
  namespaced: true,
  state: () => ({
    experiences: null,
    error: null,
    isPending: false
  }),
  mutations: {
    SET_EXPERIENCES (state, experiences) {
      state.experiences = experiences
    },
    ADD_EXPERIENCE (state, { experienceType, experience }) {
      const expArray = state.experiences[experienceType]
      let i = 0
      while (
        i < expArray.length &&
        expArray[i].semester > experience.semester
      ) {
        i++
      }
      expArray.splice(i, 0, experience)
    },
    UPDATE_EXPERIENCE (state, { id, experience }) {
      const expArray = state.experiences[experience.experienceType]
      expArray.forEach((exp, i) => {
        if (exp.id === id) {
          expArray[i] = experience
        }
      })
    },
    SET_STATUS (state, { error = undefined, isPending = undefined }) {
      if (error !== undefined) state.error = error
      if (isPending !== undefined) state.isPending = isPending
    }
  },
  actions: {
    initExperiences ({ state, dispatch }) {
      if (!state.experiences) {
        dispatch('getExperiences')
      }
    },
    async getExperiences ({ commit }) {
      try {
        commit('SET_STATUS', { isPending: true, error: null })

        const { data } = await getExperiencesAPI()

        commit('SET_EXPERIENCES', sortExperiences(data))
      } catch (error) {
        commit('SET_STATUS', { error })
      } finally {
        commit('SET_STATUS', { isPending: false })
      }
    },
    async addExperience (
      { commit },
      {
        name,
        position,
        description,
        feedback,
        semester,
        link,
        experienceType,
        tags,
        type,
        dateStart,
        dateEnd
      }
    ) {
      try {
        commit('SET_STATUS', { isPending: true, error: null })

        const { data } = await addExperienceAPI({
          name,
          position,
          description,
          feedback,
          semester,
          link,
          experienceType,
          tags,
          type,
          dateStart,
          dateEnd
        })

        commit('ADD_EXPERIENCE', { experienceType, experience: data })
      } catch (error) {
        commit('SET_STATUS', { error })
      } finally {
        commit('SET_STATUS', { isPending: false })
      }
    },
    async updateExperience ({ commit }, { id, experience }) {
      try {
        commit('SET_STATUS', { isPending: true, error: null })

        const { data } = await updateExperienceAPI(id, experience)

        commit('UPDATE_EXPERIENCE', { id: data.id, experience: data })
      } catch (error) {
        commit('SET_STATUS', { error })
      } finally {
        commit('SET_STATUS', { isPending: false })
      }
    }
  },
  getters: {
    /**
     * 把所有經驗整合到同一個array
     */
    experiencesArray (state) {
      const arr = []
      for (const type in state.experiences) {
        arr.push(...state.experiences[type])
      }
      return arr
    },
    /**
     * 將每個活動類別內的資料，依照學期分類好
     */
    classifiedExperiences (state) {
      const experiences = {}
      for (const type in state.experiences) {
        experiences[type] = classifySemester(state.experiences[type])
      }
      return experiences
    },
    /**
     * 取得不重複的所有學期
     */
    semesters (state) {
      const semesters = []
      for (const type in state.experiences) {
        semesters.push(...state.experiences[type].map(exp => exp.semester))
      }
      return [...new Set(semesters)].sort((a, b) => {
        return a > b ? -1 : 1 // 學期靠近的排在前面
      })
    }
  }
}

export default experiences
