import { useEffect, useState } from "react";
import classes from "./FilePreview.module.scss";
import removeIcon from "../../assets/icons/remove.svg";

interface filePreviewProps {
    file: File | null;
    onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: filePreviewProps) => {
    const [fileSrc, setFileSrc] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string>("");

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setFileSrc(objectUrl);
            setFileType(file.type);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    const onRemoveHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onRemove();
    };

    const renderPreview = () => {
        if (!fileSrc) return null;

        if (fileType.startsWith("image/")) {
            return (
                <img
                    className={classes.image}
                    src={fileSrc}
                    alt="uploaded image"
                />
            );
        } else if (fileType === "application/pdf") {
            return (
                <iframe
                    className={classes.pdf}
                    src={fileSrc}
                    title="uploaded pdf"
                />
            );
        } else {
            return <p>Preview not supported for this file type</p>;
        }
    };

    return (
        <div className={classes.filePreview}>
            <button className={classes.remove} onClick={onRemoveHandler}>
                <img
                    className={classes.icon}
                    src={removeIcon}
                    alt="remove file"
                />
            </button>
            {renderPreview()}
        </div>
    );
};

export default FilePreview;
