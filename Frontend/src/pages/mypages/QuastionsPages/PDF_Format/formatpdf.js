import { useState, useRef } from "react";
import "./formatpdfcss.css";
import fileDefault from "../../../../Assets/file-blank-solid-240.png";
import filePdf from "../../../../Assets/file-pdf-solid-240.png";
import UploadFile from "../../../../Assets/uploadFile.svg";

function PdfFormat() {
  const [fileList, setfileList] = useState([]);
  const inputRef = useRef(null);

  const onDragEnter = (e) => {
    inputRef.current.classList.add("dragover");
  };

  const onDragLeave = (e) => {
    inputRef.current.classLisMainSectiont.remove("dragover");
  };

  // dropping is not allowed in brawser and this stop Default
  const onDragOver = (e) => {
    e.preventDefault();
        inputRef.current.classList.add("dragover");
  };

  // in case drag and drop
  const onDrop = (e) => {
    e.preventDefault(); // this to stop prevent Default action for brawser to open this file in new tab
    inputRef.current.classList.remove("dragover");

    //access the dropped files
    const newFile = e.dataTransfer.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setfileList(updatedList);
      console.log("Selected file:", newFile);
    }
  };
  // in case upload from pc
  const onFileUpload = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setfileList(updatedList);
      console.log("Selected file:", newFile);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setfileList(updatedList);
    console.log("Selected file:", updatedList);
  };

  const ImageConfig = {
    default: fileDefault,
    pdf: filePdf,
    // png: filePng,
    // css: fileCSS,
  };

  function formatFileSize(sizeInBytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
  return (
    <>
      <section className="sectionpdf">
        <div className="mainpage">
          <div className="text1">SAVE TIME AND UPLOAD</div>
          <div className="text2">
            YOUR QUESTION BANK FOR THE <span>EXAM</span>
          </div>
          <div className="appearance">
            <div className="patt1"></div>
            <div className="patt2"></div>
            <div className="patt3"></div>
          </div>
          <div className="AllForm">
            <div className="SecondAfterAll">
              <form
                className="FormUpload"
                ref={inputRef}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => {
                  document.querySelector(".input-field").click();
                }}
              >
                <div className="contentBox">
                  <div className="textInsideBox">
                    <div className="textDrop">
                      Browse files from the button below
                    </div>
                    <div className="textDrop">or</div>
                    <div className="textDrop">
                      Drag
                      <span> & </span>
                      Drop
                    </div>
                  </div>
                  <div className="iconUpload">
                    <img
                      src={UploadFile}
                      className="uploadImage"
                      alt="Upload Icon"
                      loading="lazy"
                    />
                  </div>

                  <input
                    type="file"
                    className="input-field"
                    value=""
                    onChange={onFileUpload}
                    hidden
                  />
                </div>
              </form>
              {fileList.length > 0 && (
                <div className="DropFile">
                  <div className="DropFileTitle">Ready to upload</div>
                  {fileList.map((item, index) => (
                    <div key={index} className="DropFileItem">
                      <img
                        src={
                          ImageConfig[
                            item.type.split("/")[1] || ImageConfig["default"]
                          ]
                        }
                        alt=""
                      />
                      <div className="fileitem_info">
                        <p className="FileItemcContant">{item.name}</p>
                        <p className="FileItemcContant">
                          {formatFileSize(item.size)}
                        </p>
                      </div>
                      <span
                        className="FileItemDel"
                        onClick={() => fileRemove(item)}
                      >
                        x
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default PdfFormat;
