import { Button, Col, Row, Stack, Alert, Badge, Modal } from "react-bootstrap"
import { useNote } from './NoteLayout'
import { Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

type NoteProps = {
    onDelete: (id: string) => void
    handleDeleteNoteClick: (id: string) => void
    handleConfirmDeleteClick: () => void
    handleCancelDeleteClick: () => void
    setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>
    showConfirm: boolean
}

export function Note({ onDelete, setShowConfirm, showConfirm, handleDeleteNoteClick, handleConfirmDeleteClick, handleCancelDeleteClick }: NoteProps) {
    const note = useNote()
    const navigate = useNavigate();

    return <>
        <Row className="align-items-center mb-4">
            <Col>
                <h1>{note.title}</h1>
                {note.tags.length > 0 && <Stack
                    gap={1}
                    direction="horizontal"
                    className="flex-wrap">
                    {note.tags.map(tag => (
                        <Badge className="text-truncate" key={tag.id}>{tag.label}</Badge>
                    ))}
                </Stack>}
            </Col>
            <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                    <Link to={`/${note.id}/edit`} >
                        <Button variant="primary">Editar Nota</Button>
                    </Link>
                    <Button
                        onClick={() => handleDeleteNoteClick(note.id)}
                        variant="outline-danger"
                    >Deletar</Button>
                    <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Tem certeza que quer deletar essa nota?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Esta ação é irreversível.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCancelDeleteClick}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleConfirmDeleteClick}>
                                Deletar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Link to="/" >
                        <Button variant="outline-secondary">Voltar</Button>
                    </Link>
                </Stack>
            </Col>
        </Row>
        <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
}