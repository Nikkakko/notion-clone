import { Note } from '@prisma/client'
import * as React from 'react'

interface NotesListProps {
    notes: Note[]
}

const NotesList: React.FC<NotesListProps> = ({
    notes
}) => {
  return <div>NotesList</div>
}

export default NotesList