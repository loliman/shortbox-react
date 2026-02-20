import React from "react";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { Form, Formik } from "formik";
import Layout from "../Layout";
import FormActions from "./FormActions";
import { createDefaultFilterValues, parseFilterValues } from "./defaults";
import { serializeFilterValues } from "./serialize";
import ContentSection from "./sections/ContentSection";
import ContainsSection from "./sections/ContainsSection";
import ContributorsSection from "./sections/ContributorsSection";
import DetailsSection from "./sections/DetailsSection";
import { FilterPageProps, FilterValues } from "./types";

function FilterPage(props: FilterPageProps) {
  const { lastLocation, us, query, session, isDesktop = false, navigate } = props;
  const initialValues = React.useMemo(() => parseFilterValues(query?.filter), [query?.filter]);
  const sectionSx = {
    px: { xs: 1.25, sm: 1.75 },
    py: { xs: 1.25, sm: 1.5 },
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,249,252,0.96) 100%)",
  } as const;

  return (
    <Layout>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values: FilterValues, actions) => {
          actions.setSubmitting(true);

          const payload = serializeFilterValues(values, us);
          const url = lastLocation?.pathname ? lastLocation.pathname : `/${us ? "us" : "de"}`;

          navigate(null, url, {
            filter: payload ? JSON.stringify(payload) : null,
          });

          actions.setSubmitting(false);
        }}
      >
        {({ values, resetForm, submitForm, isSubmitting, setFieldValue }) => (
          <Form>
            <CardHeader title="Filter" />

            <CardContent sx={{ pt: 1 }}>
              <Stack spacing={2.25}>
                <Paper elevation={0} sx={sectionSx}>
                  <DetailsSection
                    values={values}
                    isDesktop={isDesktop}
                    setFieldValue={setFieldValue}
                    hasSession={Boolean(session)}
                  />
                </Paper>

                <Paper elevation={0} sx={sectionSx}>
                  <ContainsSection
                    values={values}
                    us={us}
                    isDesktop={isDesktop}
                    setFieldValue={setFieldValue}
                  />
                </Paper>

                <Paper elevation={0} sx={sectionSx}>
                  <ContributorsSection values={values} us={us} setFieldValue={setFieldValue} />
                </Paper>

                <Paper elevation={0} sx={sectionSx}>
                  <ContentSection isDesktop={isDesktop} />
                </Paper>

                <FormActions
                  isSubmitting={isSubmitting}
                  onReset={() => resetForm({ values: createDefaultFilterValues() })}
                  onCancel={() => {
                    const url = lastLocation?.pathname
                      ? lastLocation.pathname
                      : `/${us ? "us" : "de"}`;
                    navigate(null, url);
                  }}
                  onSubmit={() => submitForm()}
                />
              </Stack>
            </CardContent>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default FilterPage;
