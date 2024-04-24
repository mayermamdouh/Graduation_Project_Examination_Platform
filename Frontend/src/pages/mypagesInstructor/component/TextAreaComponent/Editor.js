import React, { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

import "./styles.css";

Quill.register("modules/imageResize", ImageResize);

const Editor = ({ value, onChange, className, placeholder }) => {
  const [editorHtml, setEditorHtml] = useState(value);

  useEffect(() => {
    setEditorHtml(value);
  }, [value]);

  const handleChange = (html) => {
    setEditorHtml(html);
    if (onChange) {
      onChange(html);
    }
  };

  return (
    <ReactQuill
      className={className}
      onChange={handleChange}
      value={editorHtml}
      modules={Editor.modules}
      formats={Editor.formats}
      bounds={"#root"}
      placeholder={placeholder}
    />
  );
};

Editor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
};

Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export default Editor;
