import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Button, TextField } from "@mui/material";
import { Container, ContainerTop, ContainerList, ContainerListItem, ContainerButton, Title } from './styles';
import { useMutation, useQuery } from "@apollo/client";
import { ADD_ITEM_MUTATION, GET_TODO_LIST, DELETE_ITEM_MUTATION, UPDATE_ITEM_MUTATION } from "./queries";
import { Delete, Edit } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useState } from "react";
import { getOperationName } from "@apollo/client/utilities";

export default function CheckboxList() {
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
        alert("Item já existe");
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
  // const [updateItem] = useMutation(UPDATE_ITEM_MUTATION,  refetchOptions);


  const onSubmit = async (event) => {
    event.preventDefault();

    if (!item.trim()) {
      alert("O nome do item não pode estar em branco.");
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

  const onUpdate = async (event) => {
    console.log(onUpdate);
    // Aqui você irá implementar a chamada para o backend de edição de item
  };


  return (
    <Container>
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
                    <Edit onClick={() => onUpdate(value?.id)} />
                    <Delete onClick={() => onDelete(value?.id)} />
                  </ListItemButton>

                </ListItem>
              );
            })}
          </ContainerListItem>
        </List>
      </ContainerList>
    </Container>
  );
}
