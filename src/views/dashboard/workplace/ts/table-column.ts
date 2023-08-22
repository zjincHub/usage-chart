import { TableColumnData } from '@arco-design/web-vue';

function getColumns1(t: any) {
  const columns: TableColumnData[] = [
    {
      title: t('workplace.index'),
      slotName: 'index',
    },
    {
      title: t('workplace.productName'),
      dataIndex: 'productName',
    },
    {
      title: t('workplace.sumOfNode'),
      dataIndex: 'sumOfNode',
      titleSlotName: 'sumOfNodeTitle',
    },
    {
      title: t('workplace.maxOfNode'),
      dataIndex: 'maxOfNode',
      titleSlotName: 'maxOfNodeTitle',
    },
    {
      title: t('workplace.useCmdCount'),
      dataIndex: 'useCmdCount',
      titleSlotName: 'useCmdCountTitle',
    },
    {
      title: t('workplace.macAdd'),
      dataIndex: 'macAdd',
      titleSlotName: 'macAddTitle',
    },
  ];
  return columns;
}
function getColumns2(t: any) {
  const columns = [
    {
      title: t('workplace.index'),
      slotName: 'index',
    },
    {
      title: t('workplace.name'),
      dataIndex: 'name',
    },
    {
      title: t('workplace.value'),
      dataIndex: 'value',
    },
    {
      title: t('workplace.valueCmdCount'),
      dataIndex: 'valueCmdCount',
    },
  ];
  return columns;
}
function getColumns3(t: any) {
  const columns = [
    {
      title: t('workplace.index'),
      slotName: 'index',
    },
    {
      title: t('workplace.company'),
      dataIndex: 'company',
    },
    {
      title: t('workplace.userName'),
      dataIndex: 'userName',
    },
    {
      title: t('workplace.computerName'),
      dataIndex: 'computerName',
    },
    {
      title: t('workplace.mac'),
      dataIndex: 'mac',
    },
    {
      title: t('workplace.cmdCount'),
      dataIndex: 'cmdCount',
    },
  ];
  return columns;
}
function getColumns4(t: any) {
  const columns = [
    {
      title: t('workplace.index'),
      slotName: 'index',
    },
    {
      title: t('workplace.cmdName'),
      dataIndex: 'cmdName',
    },
    {
      title: t('workplace.cmdSum'),
      dataIndex: 'cmdSum',
    },
  ];
  return columns;
}
export { getColumns1, getColumns2, getColumns3, getColumns4 };