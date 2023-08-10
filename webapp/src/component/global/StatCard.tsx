import { Card, CardContent, Typography } from "@mui/material";

type StatCardProps = {
  title: string;
  value: number;
};

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
