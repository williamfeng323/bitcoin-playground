import MuiTable from 'mui-virtualized-table';
import React from 'react';
import {createStyles, Theme, withStyles} from "@material-ui/core";
import {WithStyles} from "@material-ui/styles";
import './AddressTable.css';
interface AddressDataMap {
    path: string;
    prvKey: string;
    pubKey: string;
    address: string;
}

const useStyle = (theme: Theme) => {
    return createStyles({
        cellContents: {
            overflowWrap: 'anywhere'
        }
    });
}

interface Props extends WithStyles<typeof useStyle> {
    addresses: AddressDataMap[]
    selectedAddr: { [index: string]: boolean }
    setSelectedAddr: React.Dispatch<React.SetStateAction<{ [index: string]: boolean }>>
}

const AddressTable = withStyles(useStyle)(({classes, addresses, selectedAddr, setSelectedAddr}:Props) => {
    return (
      <React.Fragment>
            <MuiTable 
                data={addresses} 
                width={1500}
                rowHeight={70}
                includeHeaders={true}
                classes={{cellContents: 'cell-content'}}
                columns={[
                    {name: 'path', header: 'Path', width:150}, {name: 'address', header: 'Address'},
                    {name: 'pubKey', header: 'Public Key'}, {name:'prvKey', header: 'Private Key'}]}
                isCellSelected={(column, rowData) =>
                    selectedAddr[rowData.pubKey] || false
                }
                onCellClick={(e, rowData) => {
                    if (selectedAddr[rowData.pubKey]  || false) {
                        delete(selectedAddr[rowData.pubKey])
                    } else {
                        selectedAddr[rowData.pubKey] = true;
                    }
                    setSelectedAddr(selectedAddr);
                }}
            />
      </React.Fragment>
  );
})

export { AddressTable };
export type { AddressDataMap };
