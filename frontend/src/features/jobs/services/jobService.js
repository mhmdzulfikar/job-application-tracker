import api from '../../../lib/axios';

// ❌ getAuthHeader UDAH GUA HAPUS! Ngga guna lagi di sistem Cloud/Cookie!

export const jobService = {
    // 1. Ambil semua data
    getAll: async (config = {}) => {
        // Cukup pass config bawaan (misal params filter), Axios urus sisanya!
        const response = await api.get('/jobs', config);
        return response.data;
    },

    // 2. Tambah data baru
    create: async (data) => {
        const response = await api.post('/jobs', data);
        return response.data;
    },

    // 3. Update status (Buat Drag & Drop)
    updateStatus: async (id, status) => {
        const response = await api.put(`/jobs/${id}`, { status });
        return response.data;
    },

    // 4. Update full data (Buat Edit)
    update: async (id, data) => {
        const response = await api.put(`/jobs/${id}`, data);
        return response.data;
    },

    // 5. Hapus data
    delete: async (id) => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    }
};