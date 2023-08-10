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
      title: t('workplace.nodeTotal'),
      dataIndex: 'sumOfNode',
      titleSlotName: 'sumOfNodeTitle',
    },
    {
      title: t('workplace.nodePeak'),
      dataIndex: 'maxOfNode',
      titleSlotName: 'maxOfNodeTitle',
    },
    {
      title: t('workplace.useCmdCount'),
      dataIndex: 'useCmdCount',
      titleSlotName: 'useCmdCountTitle',
    },
    {
      title: t('workplace.newInstalledCapacity'),
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
      title: t('workplace.date'),
      dataIndex: 'name',
    },
    {
      title: t('workplace.productDosage'),
      dataIndex: 'value',
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
      title: t('workplace.index'),
      dataIndex: 'company',
    },
    {
      title: t('workplace.eMail'),
      dataIndex: 'eMail',
    },
    {
      title: t('workplace.createTime'),
      dataIndex: 'createTime',
    },
    {
      title: t('workplace.versions'),
      dataIndex: 'version',
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
      title: t('workplace.command'),
      dataIndex: 'cmd',
    },
    {
      title: t('workplace.time'),
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
      title: t('workplace.command'),
      dataIndex: 'cmdName',
    },
    {
      title: t('workplace.time'),
      dataIndex: 'cmdSum',
    },
  ];
  return columns;
}
export { getColumns1, getColumns2, getColumns3, getColumns4 };
