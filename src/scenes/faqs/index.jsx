import{ useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { listfaqs } from "../../Services/FaqsListService";

const FAQList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [faqs, setFAQs] = useState([])
  
    useEffect(() => {
        listfaqs().then((response) => {
            setFAQs(response.data);
        }).catch(error => {
            console.error(error);
        })
  
    }, [])
  
    return (
      <Box m="20px">
        <Header title="FAQ" subtitle="Frequently Asked Questions" />
  
        {faqs.map((faq) => (
          <Accordion key={faq.id} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
};
  
export default FAQList;