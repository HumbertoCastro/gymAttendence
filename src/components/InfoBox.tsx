import { Box } from "@mui/material";

export default function InfoBox({
    mainText,
    subText,
}: {
    mainText: string;
    subText: string
}) {
  const width = window.innerWidth / 4 * 0.8
  return (
    <Box
height={250}
width={width}
my={4}
display="flex"
flexDirection="column"
alignItems="center"
justifyContent='center'
gap={4}
p={2}
sx={{ backgroundColor: 'white', 
borderRadius: '6px', marginRight: '10px' }}>
  <p>{ subText }</p><p className="extra-days">{mainText}</p>

</Box>
  );
}
