import { useState, useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

/* -------------------- LOADER -------------------- */
export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
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

  const shopRes = await admin.graphql(`{ shop { id } }`);
  const shopJson = await shopRes.json();

  await admin.graphql(
    `mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
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
  
  const [percentOff, setPercentOff] = useState(config?.percentOff || 10);
  const [selectedProduct, setSelectedProduct] = useState(config?.productId || null);
  const [productTitle, setProductTitle] = useState(config?.productTitle || "No product selected");

  const isLoading = ["loading", "submitting"].includes(fetcher.state);

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Discount settings updated");
    }
  }, [fetcher.data, shopify]);

  // Function to open the Shopify Product Picker
  const selectProduct = async () => {
    const selection = await shopify.resourcePicker({
      type: "product",
      multiple: false,
    });

    if (selection) {
      const product = selection[0];
      setSelectedProduct(product.id);
      setProductTitle(product.title);
    }
  };

  const handleSave = () => {
    fetcher.submit(
      { 
        config: JSON.stringify({ 
          minQty: 2, 
          percentOff: Number(percentOff),
          productId: selectedProduct,
          productTitle: productTitle
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
              <s-text variant="headingMd">Campaign Settings - &nbsp;</s-text>
              
              {/* Product Selection Section */}
              <s-block-stack gap="200">
                <s-text variant="headingSm">Target Product - &nbsp;</s-text>
                <s-inline-stack align="space-between" block-align="center">
                  <s-text tone="subdued" >&nbsp;{productTitle}</s-text>
                  &nbsp;&nbsp;
                  <s-button onClick={selectProduct}>Select Product</s-button>
                </s-inline-stack>
              </s-block-stack>

              <s-divider />

              {/* Discount Percentage Section */}
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
                <s-button 
                  variant="primary" 
                  onClick={handleSave}
                  {...(isLoading ? { loading: true } : {})}
                >
                  Save Configuration
                </s-button>
              </s-inline-stack>

              <s-divider />
              
              <s-block-stack gap="200">
                <s-text variant="headingSm">Strategy Info</s-text>
                <s-text tone="subdued">
                  The discount and product selection are saved to <strong>Shop Metafields</strong>. 
                  The Theme Extension will only show the banner on the selected product page.
                </s-text>
              </s-block-stack>
            </s-block-stack>
          </s-card>
        </s-layout-section>
      </s-layout>
    </s-page>
  );
}