import classes from "./FilePlace.module.scss";
import uploadIcon from "../../assets/icons/upload.svg";
import React, { useCallback, useEffect, useRef, useState } from "react";
import FilePreview from "../filePreview/FilePreview";
import { useAppContext } from "../../store/AppContext";

const FilePlace = () => {
    const { setLoading, setResults, setError, setParsedResults } =
        useAppContext();
    const [fileEntering, setFileEntering] = useState<boolean>(false);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const addFileHandler = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const onFileUploaded = useCallback(async () => {
        if (
            inputRef.current &&
            inputRef.current.files &&
            inputRef.current.files[0]
        ) {
            const file = inputRef.current.files[0];
            setCurrentFile(file);
        }
    }, []);

    const onDragEnterHandler = useCallback(() => {
        setFileEntering(true);
    }, []);

    const onDragOverOrLeaveHandler = useCallback(() => {
        setFileEntering(false);
    }, []);

    const onDragOverHandler = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
        },
        []
    );

    const onDropHandler = useCallback(
        async (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            setCurrentFile(file);
            setFileEntering(false);
        },
        []
    );

    const onRemoveHandler = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setCurrentFile(null);
        setLoading(false);
        setError(null);
        setResults(null);
        setParsedResults(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const processFileInServer = useCallback(async () => {
        if (!currentFile) return;

        const url = "http://localhost:8080/process";
        const formData = new FormData();
        formData.append("file", currentFile);

        try {
            setResults(null);
            setError(null);
            setLoading(true);

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch(url, {
                method: "POST",
                body: formData,
                signal: controller.signal,
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || "Failed to process file");
            }

            setResults(result);
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            setError(
                error instanceof Error ? error : new Error("Unexpected error")
            );
            setResults(null);
            console.error("Something went wrong... ", error);
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, [currentFile, setError, setLoading, setResults]);

    useEffect(() => {
        if (currentFile) {
            processFileInServer();
        }
    }, [currentFile, processFileInServer]);

    return (
        <div
            className={`${classes.filePlace} ${
                currentFile ? classes.populated : null
            } ${fileEntering ? classes.enter : null}`}
        >
            <input
                type="file"
                className={classes.input}
                onChange={onFileUploaded}
                ref={inputRef}
                hidden
            />
            {!currentFile && (
                <div
                    className={classes.dropZone}
                    onClick={addFileHandler}
                    onDragEnter={onDragEnterHandler}
                    onDragLeave={onDragOverOrLeaveHandler}
                    onDragOver={onDragOverHandler}
                    onDrop={onDropHandler}
                >
                    <button className={classes.content}>
                        <img
                            className={classes.icon}
                            src={uploadIcon}
                            alt="upload icon"
                        />
                        <p className={classes.par}>
                            Drag and drop your file or click here to upload
                        </p>
                        <p className={classes.notice}>
                            Ensure your file is clear and properly scanned for
                            best results
                        </p>
                    </button>
                </div>
            )}
            {currentFile && (
                <FilePreview file={currentFile} onRemove={onRemoveHandler} />
            )}
        </div>
    );
};

export default FilePlace;
