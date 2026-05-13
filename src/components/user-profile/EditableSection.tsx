import { Save, X } from "lucide-react";
import Button from "../ui/Button";

interface EditableSectionProps {
  sectionKey: string;
  title?: string;
  editButtonText?: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  children: React.ReactNode;
  hasAccess: boolean;
  isLoadingForUpdate?: boolean;
  isLoadingForData?: boolean;
}

const EditableSection = ({
  title,
  editButtonText,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  children,
  hasAccess,
  isLoadingForUpdate = false,
  isLoadingForData = false,
}: EditableSectionProps) => {
  if (isLoadingForData) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-32 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 bg-gray-50 relative">
      {/* Header only when title exists */}
      {title && (
        <div className="flex items-center mb-3">
          <h4 className="section-header-custom">{title}</h4>
        </div>
      )}

      {/* Actions - ALWAYS top right */}
      <div className="absolute top-4 right-4">
        {!isEditing ? (
          hasAccess && (
            <button
              onClick={onEdit}
              className="text-blue-600 caption-custom hover:underline"
            >
              {editButtonText ? editButtonText : "Edit"}
            </button>
          )
        ) : (
          <div className="flex gap-2">
            <Button onClick={onSave} disabled={isLoadingForUpdate}>
              {isLoadingForUpdate && isEditing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                <div className="flex items-center gap-1">
                  <Save size={16} />
                  <span>Save</span>
                </div>
              )}
            </Button>

            <Button
              type="button"
              onClick={onCancel}
              disabled={isLoadingForUpdate}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              <div className="flex items-center gap-1">
                <X size={16} />
                <span>Cancel</span>
              </div>
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default EditableSection;
