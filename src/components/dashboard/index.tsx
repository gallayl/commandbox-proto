import { Bullie } from '../Bullie'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';

export const Dashboard: React.StatelessComponent = () => (
  <Paper style={{padding: "1em", margin: "1em", overflow: "auto"}}>
    <Typography variant="h3">Dashboard</Typography>
    <Bullie />
  </Paper>
)
