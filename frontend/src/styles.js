import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

export const ContainerTop = styled.form`
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

export const ContainerList = styled.div`
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

export const ContainerListItem = styled.div`
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

export const ContainerButton = styled.div`
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

export const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: #111827;
  margin-bottom: 15px;
`;