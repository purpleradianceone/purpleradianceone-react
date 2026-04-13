import {
  createLeadNote,
  getLeadNotes,
  updateLeadNote,
} from "../../../../config/apis/LeadsApi";
import { handleApiError } from "../../../../config/error/handleApiError";
import { STATUS_CODE, VALIDATIONS } from "../../../../constants/AppConstants";
import { useLoggedInUserContext } from "../../../../context/user/LoggedInUserContext";
import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../../../assets/animations/LoadingSpinner";
import LeadNotesType from "../../../../@types/lead-management/LeadNotes";
import Button from "../../../ui/Button";
import { useUserAccessModules } from "../../../../config/hooks/useAccessModules";
import COLORS from "../../../../constants/Colors";
import {
  History,
  Minus,
  NotebookPen,
  Plus,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import TextAreaInput from "../../../ui/TextAreaInput";
import { useAsyncSubmit } from "../../../../config/hooks/useAsyncSubmit";
import { Popover } from "../../../ui/PopOver";

export const LeadNotes = ({
  selectedLeadData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLeadData: any;
}) => {
  const { loginStatus } = useLoggedInUserContext();
  const { userHasAccessToAddLeadNote } = useUserAccessModules();

  const [isLoading, setIsLoading] = useState<{
    leadNote: boolean;
    inactiveLeadNote: boolean;
  }>({
    inactiveLeadNote: true,
    leadNote: true,
  });

  const [leadNotes, setLeadNotes] = useState<LeadNotesType[]>([]);
  const [leadNotesInactive, setLeadNotesInactive] = useState<LeadNotesType[]>(
    [],
  );

  const [formData, setFormData] = useState<{ note: string }>({
    note: "",
  });
  //Note : fetch api call
  const getLeadNote = async (
    status: boolean,
    setState: React.Dispatch<React.SetStateAction<LeadNotesType[]>>,
  ) => {
    // setIsLoading(true);

    if (typeof status !== "boolean") {
      return;
    }
    try {
      const postData = {
        company_id: loginStatus.companyId,
        lead_id: selectedLeadData.id,
        isactive: status,
        requestedby_id: loginStatus.id,
      };
      const response = await getLeadNotes(postData);
      if (response.status === STATUS_CODE.OK) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          leadId: item.lead_id,
          note: item.note,
          isActive: item.isactive,
          createdBy: item.createdby,
          createdOn: item.createdon,
          updatedBy: item.updatedby,
          updatedOn: item.updatedon,
        }));
        // setIsLoading(false);
        setState(formattedData);
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading({
        inactiveLeadNote: false,
        leadNote: false,
      });
    }
  };
  //Note : create lead note form close
  function handleCreateLeadNoteFormClose() {
    setFormData({
      note: "",
    });
  }

  useEffect(() => {
    getLeadNote(true, setLeadNotes);
  }, []);

  const handleLeadNoteInactiveUpdateCall = async (
    id: number,
    changedData: string,
    status?: boolean,
  ) => {
    try {
      const response = await handleLeadNoteUpdate(id, changedData, status);
      if (response) {
        if (response.data.status) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        setLeadNotesInactive([]);
        await getLeadNote(false, setLeadNotesInactive);
      }
    } catch (error) {
      handleApiError(error);
      setLeadNotesInactive([]);
      await getLeadNote(false, setLeadNotesInactive);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        leadNote: false,
      }));
    }
    // if(updateValue==="value"){

    // setLeadNotesInactive([]);
    // await getLeadNote(false, setLeadNotesInactive);
    // }
  };
  const handleLeadNoteUpdateCall = async (
    id: number,
    changedData: string,
    status?: boolean,
    updateField?: updateField,
  ) => {
    if (updateField === "status") {
      setIsLoading((prev) => ({
        ...prev,
        leadNote: true,
      }));
    }
    try {
      const response = await handleLeadNoteUpdate(id, changedData, status);
      if (response) {
        if (response.data.status) {
          toast.success(response.data.message);
          if (updateField === "status") {
            setLeadNotes([]);
            await getLeadNote(true, setLeadNotes);
          }
        } else {
          setLeadNotes([]);
          await getLeadNote(true, setLeadNotes);
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      handleApiError(error);
      setLeadNotes([]);
      await getLeadNote(true, setLeadNotes);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        leadNote: false,
      }));
    }
  };
  //Note : Update api call
  const handleLeadNoteUpdate = async (
    id: number,
    changedData: string,
    status?: boolean,
  ) => {
    try {
      if (typeof changedData === "string" && changedData.trim().length <= 0) {
        return;
      }

      const postData = {
        company_id: loginStatus.companyId,
        note: changedData.trim(),
        id: id,
        isactive: status,
        udpatedby_id: loginStatus.id,
      };
      const response = await updateLeadNote(postData);

      //   if (response) {
      //     if (response.data.status) {
      //       toast.success(response.data.message);
      //     } else {
      //       toast.error(response.data.message);
      //     }
      //   }
      return response;
    } catch (error) {
      handleApiError(error);
      //Note : if some error or exceptions occurs will refetch the data
      //   setLeadNotes([]);
      //   getLeadNote(true, setLeadNotes);
    }
  };
  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    // if (!value.trim()) return;

    setFormData({
      note: value,
    });
  };

  //Note : api call for create note
  const createNoteRequest = async () => {
    // if(formData.note && formData.note.trim().length===0){
    //     return;
    // }
    // if(formData.note.length===0){
    //     return;
    // }
    const payload = {
      company_id: loginStatus.companyId,
      lead_id: selectedLeadData.id,
      note: formData.note,
      createdby_id: loginStatus.id,
    };

    const response = await createLeadNote(payload);
    return response;
  };
  const { handleSubmit, isSubmitting } = useAsyncSubmit(createNoteRequest, {
    onSuccess: (response) => {
      if (response.data.status) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setLeadNotes([]);
      getLeadNote(true, setLeadNotes);
      handleCreateLeadNoteFormClose();
    },
    onError: (error) => {
      handleApiError(error);
      setLeadNotes([]);
      getLeadNote(true, setLeadNotes);
      handleCreateLeadNoteFormClose();
    },
  });

  // Note : api call to get inactive lead notes
  const handleShowDeletedLeadNote = async () => {
    setLeadNotesInactive([]);
    setIsLoading((prev) => ({
      ...prev,
      inactiveLeadNote: true,
    }));
    await getLeadNote(false, setLeadNotesInactive);
  };

  // Note : single render function
  const renderContent = () => {
    if (isLoading.leadNote) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (leadNotes.length === 0) {
      return (
        <>
          

          <div className=" w-full h-full flex items-center justify-center">
            <Popover
              align="right"
              width={380}
              trigger={
                <>
                  <Button className={COLORS.ADD_BUTTON}>+Add</Button>
                  <span className="caption-custom">No data</span>
                </>
              }
              padding={6}
              onClose={() => {
                handleCreateLeadNoteFormClose();
              }}
              accessRight={userHasAccessToAddLeadNote}
            >
              {(close) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsLoading((prev) => ({
                      ...prev,
                      leadNote: true,
                    }));
                    handleSubmit();
                  }}
                >
                  <TextAreaInput
                    logo={NotebookPen}
                    cols={2}
                    rows={4}
                    label="Note"
                    value={formData.note}
                    autoFocus
                    maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                    name="note"
                    onChange={handleFormInputChange}
                  />

                  <div className="flex items-center justify-end mt-1">
                    <div className="flex gap-1 h-fit">
                      <Button
                        type="button"
                        className="caption-custom white-text h-fit px-2 py-1 rounded-md  bg-gray-500 hover:bg-gray-600"
                        onClick={close}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || formData.note.length == 0}
                        className={`caption-custom white-text h-fit px-2 py-1 rounded-md
    ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : COLORS.BG_BLUE_600_COLOR}`}
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </Popover>
          </div>
        </>
      );
    }

    return (
      <div>
        {/* <div className=" w-full h-full flex  items-center justify-end"> */}
          {/* <div className="flex items-center  gap-1"> */}
            {/* Note : position pop over */}
          {/* </div> */}
        {/* </div> */}
        {/* Render Notes List Here */}
        {leadNotes &&
          leadNotes.map((note) => (
            <AccordionItem
              key={note.id}
              note={note}
              onUpdate={handleLeadNoteUpdateCall}
              //   onUpdate={handleLeadNoteUpdate}
              isUsedInDelete={false}
            >
              {/* {note.note} */}
            </AccordionItem>
          ))}
      </div>
    );
  };

  // Note : Single Return
  return (
    <div className="w-full h-full">
        
 <div className="sticky top-0 right-0 bg-white flex  items-center justify-end gap-1">
        <Popover
          onTriggerClick={() => handleShowDeletedLeadNote()}
          trigger={
            <button
              type="button"
              className=" caption-custom hover:text-gray-600 flex items-center "
            >
              <History size={12} />
              Deleted
            </button>
          }
          align="right"
          width={400}
          padding={3}
          onClose={() => {
            getLeadNote(true, setLeadNotes);
          }}
        >
          {(handleCloseButton) => (
            <>
              <div className="caption-custom flex items-center justify-between sticky top-0  bg-gray-50 w-full ">
                <span className="flex items-center px-2">
                  <span className="table-data-custom ">Note : </span>
                  {/* Following notes are deleted , you can undo the action. */}
                  Following notes have been deleted. Click “
                  <Undo2 className="text-green-500" size={12} />” to undo
                  action.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseButton();
                  }}
                >
                  <X size={14} className="hover:text-gray-600" />
                </button>
              </div>
              {isLoading.inactiveLeadNote && (
                <div className="w-full h-full flex justify-center items-center">
                  <LoadingSpinner />
                </div>
              )}
              {!isLoading.inactiveLeadNote && (
                <div className=" ">
                  <div className="min-h-20 max-h-[400px] overflow-y-auto">
                    {leadNotesInactive && leadNotesInactive.length === 0 && (
                      <div className="flex items-center  min-h-20 justify-center h-full w-full ">
                        <div className="text-center caption-custom       ">
                          No data found.
                        </div>
                      </div>
                    )}
                    {leadNotesInactive &&
                      leadNotesInactive.map((note) => (
                        <AccordionItem
                          key={note.id}
                          note={note}
                          onUpdate={handleLeadNoteInactiveUpdateCall}
                          //   onUpdate={handleLeadNoteUpdate}
                          isUsedInDelete={true}
                        >
                          {/* {note.note} */}
                        </AccordionItem>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Popover>
        <Popover
          align="right"
          width={380}
          trigger={<Button className={COLORS.ADD_BUTTON}>+Add</Button>}
          padding={6}
          onClose={() => {
            handleCreateLeadNoteFormClose();
          }}
          accessRight={userHasAccessToAddLeadNote}
        >
          {(close) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // changes done here

                if (formData.note && formData.note.trim().length > 0) {
                  setIsLoading((prev) => ({
                    ...prev,
                    leadNote: true,
                  }));
                  handleSubmit();
                }
              }}
            >
              <TextAreaInput
                logo={NotebookPen}
                cols={2}
                rows={4}
                label="Note"
                value={formData.note}
                autoFocus
                maxLength={VALIDATIONS.MAX_DESCRIPTION_LENGTH}
                name="note"
                onChange={handleFormInputChange}
              />

              <div className="flex items-center justify-end mt-1">
                <div className="flex gap-1 h-fit">
                  <Button
                    type="button"
                    className={`caption-custom white-text h-fit px-2 py-1 rounded-md  ${COLORS.BG_GRAY_500_COLOR} ${COLORS.HOVER_BG_GRAY_600_COLOR_HOVER}`}
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || formData.note.length == 0}
                    // disabled={isSubmitting}
                    className={`caption-custom white-text h-fit px-2 py-1 rounded-md
    ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : COLORS.BG_BLUE_600_COLOR}`}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Popover>
      </div>
            
     
      {renderContent()}
    </div>
  );
};

type AccordionItemProps = {
  note: LeadNotesType;
  onUpdate: (
    id: number,
    updatedNote: string,
    udpateStatus?: boolean,
    updateField?: updateField,
  ) => Promise<void>;
  isUsedInDelete: boolean;
  //   updateField : updateField
};

export type updateField = "value" | "status";
export function AccordionItem({
  note,
  onUpdate,
  isUsedInDelete = false,
}: AccordionItemProps) {
  const isOpen = true;
  const { userHasAccessToUpdateLeadNote } = useUserAccessModules();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(note.note.trim());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (isEditing) {
          setIsEditing(false);

          //note : when value becomes empty then undo the action and set the original value
          if (value.trim().length === 0 && note.note) {
            setValue(note.note);
          }

          //   Note : if value and note are note the same then only give the call
          if (value && value.trim() !== note.note) {
            onUpdate(note.id, value.trim(), note.isActive, "value"); // API call
          }
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, value, note, onUpdate]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const length = textareaRef.current.value.length;

      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  return (
    <div ref={wrapperRef} key={note.id} className="w-full px-1 pb-1">
      <div
        className="bg-white border  border-blue-200 rounded-md shadow-sm  
        hover:shadow-md transition-all duration-300"
      >
        {/* HEADER */}
        <div className="flex">
            <button
          onClick={() => {
            if (!isUsedInDelete && userHasAccessToUpdateLeadNote) {
                
              setIsEditing(true);
            }
          }}
          //   onClick={() => setIsOpen(true)}
          className="w-full text-left p-1 flex justify-between items-start"
        >
          <div className="flex flex-col w-full">
            {/* Collapsed → Single Line */}
            {/* {!isOpen  && (
              <span className="text-sm text-gray-700 truncate">
                {note.note}
              </span>
            )} */}

            {/* Expanded → Full Note */}
            {isOpen && !isEditing && (
              <span
                className={`${!isUsedInDelete ? "" : "cursor-pointer"} text-sm px-2 text-gray-800 whitespace-pre-wrap `}
                // onClick={(e) => {
                //   e.stopPropagation();
                //   if (!isUsedInDelete && userHasAccessToUpdateLeadNote) {
                //     setIsEditing(true);
                //   }
                // }}
              >
                {value}
              </span>
            )}

            {/* Edit Mode */}
            {isOpen&& isEditing && !isUsedInDelete && (
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-sm border border-blue-200 rounded-md p-2 
                focus:outline-none ring-1 focus:ring-blue-400 resize-none"
                rows={4}
                autoFocus
              />
            )}
          </div>

         
        </button>
         <span
            onClick={() => {
              if (!isUsedInDelete  &&  userHasAccessToUpdateLeadNote) {
                console.log(isEditing);
                
                setIsEditing(!isEditing);

              }

              // setIsEditing(!isEditing)
            }}
            className="ml-3 text-blue-600 mt-1 "
          >
            {!isUsedInDelete ? (
              isEditing ? (
                <Minus size={18} />
              ) : (
                <Plus size={18} />
              )
            ) : (
              ""
            )}
          </span>

        </div>
        

        {/* EXPANDED META DATA */}
        <div
          //   onClick={() => setIsEditing(false)}
          className={`overflow-hidden transition-all duration-400 ease-in-out max-h-40 opacity-100 `
        
        }
        >
          <div className="flex justify-between pl-3 pr-2 py-1 border-t bg-gray-100 text-xs text-gray-600 rounded-b-md">
            <span>
              By - {isUsedInDelete ? note.updatedBy : note.createdBy}{" "}
            </span>
            <div className="flex items-center gap-1">
              <span>{new Date(note.createdOn).toLocaleDateString()}</span>
              <button
                onClick={() => {
                  if (userHasAccessToUpdateLeadNote) {
                    onUpdate(note.id, value, !note.isActive, "status");
                    return;
                  } else {
                    toast.error(
                      "you dont have required permission to perform this activity",
                    );
                  }
                }}
                type="button"
                className="text-red-500  px-1 rounded-md "
              >
                {isUsedInDelete ? (
                  <Undo2 size={14} className="text-green-500" />
                ) : (
                  <Trash2 size={12} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
