import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FiEdit3, FiTrash2, FiPlus } from "react-icons/fi";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/operations/adminAPI";
import Spinner from "../../components/common/Spinner";

function ManageCategories() {
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await fetchAllCategories(token);
      setCategories(data || []);
    } catch (error) {
      toast.error(error.message || "Could not load categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, name, description, token);
      } else {
        await createCategory(name, description, token);
      }
      setName("");
      setDescription("");
      setEditingId(null);
      await load();
    } catch (error) {
      toast.error(error.message || "Could not save category");
    }
    setSaving(false);
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category? Courses in it will keep their data but lose this category link.")) {
      return;
    }
    try {
      await deleteCategory(categoryId, token);
      await load();
    } catch (error) {
      toast.error(error.message || "Could not delete category");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-richblack-5">
        Manage Categories
      </h1>

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-md border border-richblack-700 bg-richblack-800 p-6"
      >
        <h2 className="text-lg font-semibold text-richblack-5">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        <div>
          <label className="mb-1 block text-sm text-richblack-100">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Web Development"
            className="w-full rounded-md border border-richblack-700 bg-richblack-900 px-4 py-2 text-sm text-richblack-5 outline-none focus:border-yellow-50"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-richblack-100">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of the category"
            rows={2}
            className="w-full rounded-md border border-richblack-700 bg-richblack-900 px-4 py-2 text-sm text-richblack-5 outline-none focus:border-yellow-50"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25 disabled:opacity-50"
          >
            <FiPlus />
            {saving ? "Saving..." : editingId ? "Update" : "Add Category"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setDescription("");
              }}
              className="rounded-md border border-richblack-700 bg-richblack-700 px-4 py-2 text-sm font-semibold text-richblack-100 hover:bg-richblack-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {categories.length === 0 ? (
        <p className="text-sm text-richblack-300">No categories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-richblack-700 text-left text-sm">
            <thead>
              <tr className="text-richblack-200">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Courses</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {categories.map((category) => (
                <tr key={category._id} className="text-richblack-100">
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3">{category.description || "—"}</td>
                  <td className="px-4 py-3">{category.courseCount}</td>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <button
                      onClick={() => startEdit(category)}
                      title="Edit"
                      className="text-richblack-300 hover:text-yellow-50"
                    >
                      <FiEdit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      title="Delete"
                      className="text-richblack-300 hover:text-pink-200"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;
