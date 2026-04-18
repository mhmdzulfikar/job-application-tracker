import api from '../../../lib/axios';

// Helper buat ngambil tiket satpam otomatis
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const jobService = {
    // 1. Ambil semua data
    getAll: async (config) => {
        const response = await api.get('/jobs', config  );
        return response.data;
    },

    // 2. Tambah data baru
    create: async (data) => {
        const response = await api.post('/jobs', data, getAuthHeader());
        return response.data;
    },

    // 3. Update status (Buat Drag & Drop)
    updateStatus: async (id, status) => {
        const response = await api.put(`/jobs/${id}`, { status }, getAuthHeader());
        return response.data;
    },

    // 4. Update full data (Buat Edit)
    update: async (id, data) => {
        const response = await api.put(`/jobs/${id}`, data, getAuthHeader());
        return response.data;
    },

    // 5. Hapus data
    delete: async (id) => {
        const response = await api.delete(`/jobs/${id}`, getAuthHeader());
        return response.data;
    }
};