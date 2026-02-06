import { useState, useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

/* -------------------- LOADER -------------------- */
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  // Fetch the saved discount from Shopify Metafields
  const response = await admin.graphql(`
    query {
      shop {
        metafield(namespace: "volume_discount", key: "rules") {
          value
        }
      }
    }
  `);

  const json = await response.json();
  const savedData = json.data.shop.metafield?.value 
    ? JSON.parse(json.data.shop.metafield.value) 
    : null;

  return { config: savedData };
};

/* -------------------- ACTION -------------------- */
export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const config = formData.get("config");

  // Get Shop ID to use as the ownerId for the Metafield
  const shopRes = await admin.graphql(`{ shop { id } }`);
  const shopJson = await shopRes.json();

  // Save the JSON config to Shopify Metafields
  await admin.graphql(
    `mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        metafields: [{
          namespace: "volume_discount",
          key: "rules",
          type: "json",
          ownerId: shopJson.data.shop.id,
          value: config,
        }],
      },
    }
  );

  return { success: true };
};

/* -------------------- UI COMPONENT -------------------- */
export default function Index() {
  const { config } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  
  // State for the discount percentage
  const [percentOff, setPercentOff] = useState(config?.percentOff || 10);
  
  const isLoading = ["loading", "submitting"].includes(fetcher.state);

  // Show a Shopify Toast notification when save is successful
  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Discount settings updated");
    }
  }, [fetcher.data, shopify]);

  const handleSave = () => {
    fetcher.submit(
      { 
        config: JSON.stringify({ 
          minQty: 2, 
          percentOff: Number(percentOff) 
        }) 
      }, 
      { method: "POST" }
    );
  };

  return (
    <s-page heading="Volume Discount Configuration">
      <s-layout>
        <s-layout-section>
          <s-card>
            <s-block-stack gap="500">
              <s-text variant="headingMd">Campaign Settings</s-text>
              <s-paragraph>
                Define the discount percentage that will be applied when a customer buys 2 or more items.
              </s-paragraph>
              
              <s-box padding-block-end="400">
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontWeight: '600',
                  fontSize: '14px' 
                }}>
                  Discount Percentage (%)
                </label>
                <input 
                  type="number" 
                  value={percentOff} 
                  onChange={(e) => setPercentOff(e.target.value)}
                  min="1"
                  max="99"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #bcbfc2',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </s-box>

              <s-inline-stack align="end">
                {/* variant="primary" gives the Blue Shopify Button */}
                <s-button 
                  variant="primary" 
                  onClick={handleSave}
                  {...(isLoading ? { loading: true } : {})}
                >
                  Save Configuration
                </s-button>
              </s-inline-stack>
            </s-block-stack>
          </s-card>
        </s-layout-section>

        <s-layout-section variant="aside">
          <s-card>
            <s-block-stack gap="300">
              <s-text variant="headingSm">Strategy Info</s-text>
              <s-paragraph>
                This discount data is saved to <strong>Shop Metafields</strong>. 
                Your Theme App Extension will read this value to display the banner on the product page.
              </s-paragraph>
            </s-block-stack>
          </s-card>
        </s-layout-section>
      </s-layout>
    </s-page>
  );
}