import React from "react";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { type Theme } from "@mui/material/styles";
import { Form, Formik } from "formik";
import Layout from "../Layout";
import FormActions from "./FormActions";
import { createDefaultFilterValues, parseFilterValues } from "./defaults";
import { serializeFilterValues } from "./serialize";
import ContainsSection from "./sections/ContainsSection";
import ContributorsSection from "./sections/ContributorsSection";
import DetailsSection from "./sections/DetailsSection";
import { FilterPageProps, FilterValues } from "./types";

function FilterPage(props: FilterPageProps) {
  const { lastLocation, us, query, session, isDesktop = false, navigate } = props;
  const initialValues = React.useMemo(() => parseFilterValues(query?.filter), [query?.filter]);
  const [activeTab, setActiveTab] = React.useState(0);
  const sectionSx = {
    px: { xs: 1.25, sm: 1.75 },
    py: { xs: 1.25, sm: 1.5 },
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: (theme: Theme) => theme.shadows[1],
    backgroundColor: "background.paper",
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
                  <Stack spacing={2}>
                    <Tabs
                      value={activeTab}
                      onChange={(_, value) => setActiveTab(value)}
                      variant="scrollable"
                      allowScrollButtonsMobile
                    >
                      <Tab label="Erscheinung" />
                      <Tab label="Inhalt" />
                      <Tab label="Mitwirkende" />
                    </Tabs>

                    {activeTab === 0 ? (
                      <DetailsSection
                        values={values}
                        us={us}
                        isDesktop={isDesktop}
                        setFieldValue={setFieldValue}
                        hasSession={Boolean(session)}
                      />
                    ) : null}

                    {activeTab === 1 ? (
                      <ContainsSection
                        values={values}
                        us={us}
                        isDesktop={isDesktop}
                        setFieldValue={setFieldValue}
                      />
                    ) : null}

                    {activeTab === 2 ? (
                      <ContributorsSection values={values} us={us} setFieldValue={setFieldValue} />
                    ) : null}
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={sectionSx}>
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
                </Paper>
              </Stack>
            </CardContent>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default FilterPage;
