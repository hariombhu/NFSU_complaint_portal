import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/api';
import { Upload, ArrowLeft } from 'lucide-react';

const SubmitComplaint = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        priority: 'medium',
        anonymous: false,
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        'Canteen',
        'Academic',
        'Maintenance',
        'Auditorium',
        'Administration',
        'Sports',
        'Others',
    ];

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
            console.log('Starting complaint submission...');
            console.log('Form Data:', formData);
            console.log('Files:', files);

            const submitData = new FormData();
            Object.keys(formData).forEach((key) => {
                submitData.append(key, formData[key]);
                console.log(`Added ${key}:`, formData[key]);
            });

            files.forEach((file) => {
                submitData.append('attachments', file);
                console.log('Added file:', file.name);
            });

            console.log('Submitting to API...');
            const response = await complaintService.create(submitData);
            console.log('API Response:', response);

            alert('Complaint submitted successfully! Redirecting to tracking page...');
            navigate('/student/track-complaints');
        } catch (err) {
            console.error('Full error:', err);
            console.error('Error response:', err.response);
            console.error('Error message:', err.response?.data?.message);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to submit complaint';
            setError(errorMsg);
            alert(`Error submitting complaint: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="glass rounded-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Submit Complaint
                    </h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Brief summary of your complaint"
                                maxLength={200}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Describe your complaint in detail..."
                                maxLength={2000}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.description.length}/2000 characters
                            </p>
                        </div>

                        <div>
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
                        </div>

                        <div>
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
                        </div>

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
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitComplaint;
