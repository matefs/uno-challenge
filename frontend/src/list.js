import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Button, TextField } from "@mui/material";
import { styled } from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_ITEM_MUTATION, GET_TODO_LIST, DELETE_ITEM_MUTATION, UPDATE_ITEM_MUTATION } from "./queries";
import { Delete, Edit } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useState } from "react";
import { getOperationName } from "@apollo/client/utilities";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const ContainerTop = styled.form`
  display: flex;
  background-color: #ffffff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  width: 92%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const ContainerList = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  gap: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const ContainerListItem = styled.div`
  background-color: #f1f5f9;
  padding: 15px;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const ContainerButton = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  button {
    border-radius: 8px;
    background-color: #3b82f6;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: #111827;
  margin-bottom: 15px;
`;

export default function CheckboxList() {
  const [item, setItem] = useState("");
  const [filterStringFromItem, setFilterStringFromItem] = useState("");

  const { data, refetch } = useQuery(GET_TODO_LIST, {
    variables: { filter: filterStringFromItem ? { name: filterStringFromItem } : {} }, // Passa um objeto vazio se filter for falso
  });

  const handleFilterClick = () => {
    setFilterStringFromItem(item);
    setItem("");
    refetch({ filter: filterStringFromItem ? { name: filterStringFromItem } : {} });
  };


  const [addItem] = useMutation(ADD_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    awaitRefetchQueries: true,
    refetchQueries: [getOperationName(GET_TODO_LIST)],
  });
  // const [updateItem] = useMutation(UPDATE_ITEM_MUTATION,  refetchOptions);


  const onSubmit = async (event) => {
    event.preventDefault();
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
