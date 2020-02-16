import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import IOrder from 'interfaces/models/order';
import DeleteIcon from 'mdi-react/DeleteIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderService from 'services/order';

interface IProps {
  order: IOrder;
  onDeleteComplete: () => void;
}

const ListItem = memo((props: IProps) => {
  const { order, onDeleteComplete } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o pedido ${order.description}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => orderService.delete(order.id)),
      logError(),
      tap(
        () => {
          Toast.show(`${order.description} foi removido`);
          setLoading(true);
          setDeleted(true);
          onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const options = useMemo<IOption[]>(() => {
    return [{ text: 'Excluir', icon: DeleteIcon, handler: handleDelete }];
  }, [handleDelete]);

  if (deleted) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{order.description}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItem;
