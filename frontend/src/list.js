import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Button, TextField,Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Container, ContainerTop, ContainerList, ContainerListItem, ContainerButton, Title } from './styles';
import { useMutation, useQuery } from "@apollo/client";
import { ADD_ITEM_MUTATION, GET_TODO_LIST, DELETE_ITEM_MUTATION, UPDATE_ITEM_MUTATION } from "./queries";
import { Delete, Edit } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useState } from "react";
import { getOperationName } from "@apollo/client/utilities";
import SnackbarTemporizado from './Components/Snackbar/SnackbarTemporizado';


export default function CheckboxList() {

  const [newTodo, setNewTodo] = useState({});
  const [showAlert,setShowAlert] = useState(false);
  const [showAlertMessage,setShowAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleClickOpen = (id,name) => {
    setNewTodo({id:id,name:name});
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [item, setItem] = useState("");
  const [filterStringFromItem, setFilterStringFromItem] = useState("");

  const { data, refetch } = useQuery(GET_TODO_LIST, {
    variables: { filter: filterStringFromItem ? { name: filterStringFromItem } : {} },
  });

  const handleFilterClick = () => {
    setFilterStringFromItem(item);
    setItem("");
    refetch({ filter: filterStringFromItem ? { name: filterStringFromItem } : {} });
  };


  const [addItem, { loading }] = useMutation(ADD_ITEM_MUTATION, {
    onCompleted: (data) => {
      if (!data.addItem) {
        setShowAlertMessage("Item já existe");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 1000);

      } else {
        setItem("");
      }
    },
    onError: (error) => {
    }
  });
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    awaitRefetchQueries: true,
    refetchQueries: [getOperationName(GET_TODO_LIST)],
  });
  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION,  {
    awaitRefetchQueries: true,
    refetchQueries: [getOperationName(GET_TODO_LIST)],
  });


  const onSubmit = async (event) => {
    event.preventDefault();

    if (!item.trim()) {
      setShowAlertMessage("O nome do item não pode estar em branco.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1000);
      return;
    }

    await addItem({
      variables: {
        values: {
          name: item,
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: [getOperationName(GET_TODO_LIST)],
    });
    setItem("");
  };

  const onDelete = async (id) => {
    try {
      await deleteItem({
        variables: { id },
      });
      console.log(`Item ${id} deletado com sucesso`);
    } catch (error) {
      console.error("Erro ao deletar item:", error);
    }
  };

    const onUpdate = async () => {
      const trimmedName = newTodo?.name.trim();

      if (!trimmedName) {
        setShowAlertMessage("O nome do item não pode estar em branco.");
        setShowAlert(true);
        return;
      }

      await updateItem({
        variables: {
          values: {
            id: newTodo?.id,
            name: newTodo?.name.trim(),
          },
        },
      });
    };


  return (
    <Container>
      {showAlert && (
          <SnackbarTemporizado message={showAlertMessage} duration={3000} />
      )}
      <ContainerList>
        <Title>TODO LIST</Title>
        <ContainerTop onSubmit={onSubmit}>
          <TextField
            id="item"
            label="Nome da tarefa"
            value={item}
            type="text"
            variant="standard"
            onChange={(e) => setItem(e?.target?.value)}
          />
          <ContainerButton>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              color="info"
              onClick={ handleFilterClick }
            >
              Filtrar
              <FilterAltIcon sx={{marginLeft: 1}}/>
            </Button>
            <Button
                variant="contained"
                onClick={() => setFilterStringFromItem("")}
            >
              <FilterAltOffIcon />
            </Button>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              color="success"
              type="submit"
            >
              Salvar
              <AddIcon sx={{marginLeft: 1}}/>
            </Button>
          </ContainerButton>
        </ContainerTop>
        <List sx={{ width: "100%" }}>
          <ContainerListItem>
            {data?.todoList?.length === 0 ? <p>Nenhuma tarefa cadastrada</p>: null}
            {data?.todoList?.map((value, index) => {
              return (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    borderRadius: "5px",
                    marginTop: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <ListItemButton dense>
                    <ListItemText id={index} primary={value?.name} />
                    <Edit onClick={() => {  handleClickOpen(value?.id,value?.name); }} />
                    <Delete onClick={() => onDelete(value?.id)} />
                  </ListItemButton>

                </ListItem>

              );
            })}
          </ContainerListItem>
        </List>
      </ContainerList>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Item</DialogTitle>
        <DialogContent>
          <TextField
              variant="outlined"
              value={newTodo?.name}
              onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
              fullWidth
              sx={{ marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {  onUpdate(newTodo?.id); handleClose(); }} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
