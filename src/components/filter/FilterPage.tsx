import React from "react";
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

            <CardContent className="cardContent">
              <Stack spacing={5}>
                <DetailsSection
                  values={values}
                  isDesktop={isDesktop}
                  setFieldValue={setFieldValue}
                  hasSession={Boolean(session)}
                />

                <ContainsSection
                  values={values}
                  us={us}
                  isDesktop={isDesktop}
                  setFieldValue={setFieldValue}
                />

                <ContributorsSection values={values} us={us} setFieldValue={setFieldValue} />

                <ContentSection isDesktop={isDesktop} />

                <FormActions
                  isSubmitting={isSubmitting}
                  onReset={() => resetForm({ values: createDefaultFilterValues() })}
                  onCancel={() => {
                    const url = lastLocation?.pathname ? lastLocation.pathname : `/${us ? "us" : "de"}`;
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
