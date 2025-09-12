import { useEffect } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const TipTapEditor = ({ value, onChange, placeholder = "Write your essay here…" }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    autofocus: "end",
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) editor.commands.setContent(value);
  }, [value, editor]);

  if (!editor) return null;

  const is = (cond: boolean) => (cond ? "active" : "");

  return (
    <div className="border rounded-3">
      {/* Toolbar */}
      <div className="d-flex flex-wrap gap-2 p-2 border-bottom bg-light rounded-top">
        <ButtonGroup size="sm">
          <Button
            variant="outline-secondary"
            className={is(editor.isActive("heading", { level: 1 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </Button>
          <Button
            variant="outline-secondary"
            className={is(editor.isActive("heading", { level: 2 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Button>
          <Button
            variant="outline-secondary"
            className={is(editor.isActive("heading", { level: 3 }))}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm">
          <Button
            variant="outline-secondary"
            className={is(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            Bold
          </Button>
          <Button
            variant="outline-secondary"
            className={is(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            Italic
          </Button>
          <Button variant="outline-secondary" className={is(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>
            Strike
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm">
          <Button variant="outline-secondary" className={is(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            • List
          </Button>
          <Button variant="outline-secondary" className={is(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            1. List
          </Button>
          <Button variant="outline-secondary" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={is(editor.isActive("blockquote"))}>
            “Quote”
          </Button>
          <Button variant="outline-secondary" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            — HR —
          </Button>
        </ButtonGroup>

        <ButtonGroup size="sm" className="ms-auto">
          <Button variant="outline-secondary" onClick={() => editor.chain().focus().undo().run()}>
            Undo
          </Button>
          <Button variant="outline-secondary" onClick={() => editor.chain().focus().redo().run()}>
            Redo
          </Button>
          <Button variant="outline-danger" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
            Clear
          </Button>
        </ButtonGroup>
      </div>

      {/* Area di editing */}
      <div className="editor-shell rounded-bottom-3">
        {/* la toolbar del tuo TiptapEditor */}
        <div className="editor-toolbar p-2">{/* i tuoi Button / ButtonGroup */}</div>

        {/* area di editing: scorre dentro, la card NON si allunga */}
        <div className="editor-content">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;
