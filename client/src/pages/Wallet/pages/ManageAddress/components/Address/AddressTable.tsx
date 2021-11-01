import MuiTable from 'mui-virtualized-table';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import React from 'react';
import {createStyles, Theme, Typography, withStyles} from "@material-ui/core";
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
        tableName: {
            marginTop: "15px",
        },
        cellContents: {
            overflowWrap: 'anywhere'
        }
    });
}

interface Props extends WithStyles<typeof useStyle> {
    addresses: AddressDataMap[]
}

const AddressTable = withStyles(useStyle)(({classes, addresses}:Props) => {
  return (
      <React.Fragment>
            <Typography variant="h5" className={classes.tableName}>Address Table</Typography>
            <AutoSizer>
                {
                    ({ width}) => (
                    <MuiTable 
                        data={addresses} 
                        width={width}
                        rowHeight={70}
                        includeHeaders={true}
                        classes={{cellContents: 'cell-content'}}
                        columns={[
                            {name: 'path', header: 'Path', width:120}, {name: 'address', header: 'Address'}, 
                            {name: 'pubKey', header: 'Public Key'}, {name:'prvKey', header: 'Private Key'}]} 
                    />)
                }
            </AutoSizer>
      </React.Fragment>
  );
})

export { AddressTable };
export type { AddressDataMap };
