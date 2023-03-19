import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap';
import { useMemo, useState } from "react"
import { Routes, Route, Navigate } from 'react-router-dom';
import NewNote from './NewNote';
import { useLocalStorage } from './useLocalStorage';
import { v4 as uuidV4 } from 'uuid';
import { NoteList } from './NoteList';
import { NoteLayout } from './NoteLayout';
import { Note } from './Note';
import EditNote from './EditNote';
import Alert from 'react-bootstrap/Alert';

//Tipo nota que tem um Id e herda do NoteData titulo, markdown, tags
export type Note = {
  id: string
} & NoteData

//Tipo RawNote que tem um Id e herda do RawNoteData titulo, markdown, tagsIds
export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[],
}
//Cada tag tem uma label(nome) e um Id
export type Tag = {
  id: string
  label: string
}

function App() {
  //setNotes salva a nota e o array de conteúdo da nota, ou seja o corpo, titulo, tags, etc.
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  //setTags salva a TAG e o array com as tags
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const [showConfirm, setShowConfirm] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState("");

  function handleDeleteNoteClick(id: string) {
    setNoteIdToDelete(id);
    setShowConfirm(true);
  }

  function handleConfirmDeleteClick() {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== noteIdToDelete);
    });
    setNoteIdToDelete("");
    setShowConfirm(false);
  }

  function handleCancelDeleteClick() {
    setNoteIdToDelete("");
    setShowConfirm(false);
  }

  /* O useMemo é um hook do React que permite memoizar (caching) o resultado de uma função/método, 
  evitando que o mesmo seja recalculado a cada renderização do componente. Nesse caso ele retorna todas as notas e tags, caso a tag possua um id */
  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  //cria a nota e salva dentro do array notes
  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) },
      ]
    })
  }

  //Compara o id da nota com o id das notas no array de notas e edita
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string) {
    const confirmed = window.confirm("Tem certeza que quer deletar essa nota?");
    if (confirmed) {
      setNotes(prevNotes => {
        return prevNotes.filter(note => note.id !== id);
      });
    }
  }


  //pega todas as tags anteriores e adiciona uma no final do array de tags;
  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag;
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path='/' element={<NoteList notes={notesWithTags} availableTags={tags} onUpdateTag={updateTag} onDeleteTag={deleteTag} />} />
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />} >
          <Route index element={<Note showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          handleDeleteNoteClick={handleDeleteNoteClick}
           handleConfirmDeleteClick={handleConfirmDeleteClick}
            handleCancelDeleteClick={handleCancelDeleteClick}
             onDelete={onDeleteNote} />}
             />
          <Route path='edit' element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
