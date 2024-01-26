import CodeMirror from '@uiw/react-codemirror';
import { autocompletion } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import useDataService from '../../service/DataService';

import './autocompleteInput.css';

function myCompletions(context, data) {
  const word = context.matchBefore(/\w*/);
  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1);
  const text = context.state
    .sliceDoc(nodeBefore.from, context.pos)
    .toLowerCase();
  const tagBefore = /[\\+\-\\*\\(\\)\\^\\/] ?[a-zA-Z0-9]+$/.exec(text);
  const isFirstWord = text.split(' ').length === 1;

  if (!isFirstWord && !tagBefore) {
    return;
  }

  return {
    from: word.from,
    options: [
      ...data.map((item) => ({
        ...item,
        label: item.name,
        apply: `${item.name}`,
      })),
    ],
    validFor: /\w*/,
  };
}

const AutocompleteInput = () => {
  const { data, isPending, error } = useDataService();

  const useInputStore = create(
    devtools((set) => ({
      tag: [],
      addTag: (newTag) => set((state) => ({ tag: [...state.tag, newTag] })),
      removeTag: (tagToRemove) =>
        set((state) => ({
          tag: [...state.tag.filter((item) => item.id !== tagToRemove.id)],
        })),
    }))
  );

  const addTag = useInputStore((state) => state.addTag);
  const removeTag = useInputStore((state) => state.removeTag);

  const errorMessage = error ? <p>Error</p> : null;
  const spinner = isPending ? <p>Loading...</p> : null;
  const content = !(isPending || error) ? (
    <View data={data} addTag={addTag} removeTag={removeTag} />
  ) : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ data, addTag, removeTag }) => {
  return (
    <div className="editor-wrapper">
      <CodeMirror
        value=""
        extensions={[
          autocompletion({ override: [(e) => myCompletions(e, data)] }),
        ]}
        basicSetup={{
          lineNumbers: false,
          indentWithTabs: false,
          indentUnit: 4,
        }}
        onChange={(value, viewUpdate) => {
          addTag(value);
        }}
      />
    </div>
  );
};

export default AutocompleteInput;
