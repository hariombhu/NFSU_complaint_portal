import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { complaintService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SuccessAnimation from '../components/SuccessAnimation';

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const prefilledCategory = searchParams.get('category') || '';

    const [formData, setFormData] = useState({
        category: prefilledCategory,
        title: '',
        description: '',
        priority: 'medium',
        anonymous: false,
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const categories = [
        'Canteen',
        'Academic',
        'Maintenance',
        'Auditorium',
        'Administration',
        'Sports',
        'Others',
    ];

    const categoryIcons = {
        Canteen: '🍽️', Academic: '📚', Maintenance: '🔧',
        Auditorium: '🎭', Administration: '🏛️', Sports: '⚽', Others: '📋',
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach((key) => {
                submitData.append(key, formData[key]);
            });

            files.forEach((file) => {
                submitData.append('attachments', file);
            });

            await complaintService.create(submitData);
            setShowSuccess(true);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to submit complaint';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {showSuccess && (
                    <SuccessAnimation
                        onComplete={() => navigate('/student/dashboard')}
                    />
                )}
            </AnimatePresence>

            <PageTransition className="min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                        whileHover={{ x: -4 }}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </motion.button>

                    <motion.div
                        className="glass rounded-xl p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            Submit Complaint
                        </h1>

                        {error && (
                            <motion.div
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                {prefilledCategory ? (
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-blue-50 text-blue-800 font-semibold flex items-center space-x-2">
                                        <span className="text-lg">{categoryIcons[prefilledCategory]}</span>
                                        <span>{prefilledCategory}</span>
                                    </div>
                                ) : (
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                                    placeholder="Brief summary of your complaint"
                                    maxLength={200}
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
                                    placeholder="Describe your complaint in detail..."
                                    maxLength={2000}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.description.length}/2000 characters
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Attachments (Optional)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                                                <span>Upload files</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    className="sr-only"
                                                    accept="image/*,.pdf,.doc,.docx"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, PDF, DOC up to 5MB each
                                        </p>
                                    </div>
                                </div>
                                {files.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">
                                            Selected files: {files.map((f) => f.name).join(', ')}
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="anonymous"
                                    checked={formData.anonymous}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Submit anonymously
                                </label>
                            </div>

                            <div className="flex space-x-4">
                                <motion.button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 ripple"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : 'Submit Complaint'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </PageTransition>
        </>
    );
};

export default SubmitComplaint;
