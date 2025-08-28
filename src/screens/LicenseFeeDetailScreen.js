import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

const LicenseFeeDetailScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const { licenseFee } = route.params;
  const [webViewHeight, setWebViewHeight] = useState(300);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getColorForLicenseType = (licenseType) => {
    const colors = {
      'motorcycle': '#007AFF',
      'car': '#28a745', 
      'heavy_vehicle': '#dc3545',
      'renewal': '#ffc107',
      'international': '#6f42c1',
      'learner': '#17a2b8'
    };
    return colors[licenseType] || '#6c757d';
  };

  const renderHeaderRight = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={handleBackPress}
    >
      <Ionicons name="arrow-back" size={24} color="#115740" />
    </TouchableOpacity>
  );

  // HTML template for WebView to display rich content
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 16px;
          background-color: #f5f5f5;
          color: #333;
          line-height: 1.6;
          min-height: 100vh;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        * {
          max-width: 100%;
          box-sizing: border-box;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #115740;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        p {
          margin-bottom: 16px;
          font-size: 16px;
        }
        strong {
          color: #115740;
          font-weight: 600;
        }
        ul, ol {
          padding-left: 20px;
          margin-bottom: 16px;
        }
        li {
          margin-bottom: 8px;
          font-size: 16px;
        }
        blockquote {
          border-left: 4px solid #115740;
          margin: 16px 0;
          padding-left: 16px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        .highlight {
          background-color: #fff3cd;
          padding: 2px 4px;
          border-radius: 3px;
        }
      </style>
      <script>
        window.addEventListener('load', function() {
          const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          );
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(height.toString());
          }
        });
      </script>
    </head>
    <body>
      ${licenseFee.rich_content || licenseFee.description || 'No detailed content available.'}
    </body>
    </html>
  `;

  // Extract fee amount from various possible fields
  const getFeeAmount = (data) => {
    return data?.fee_rs || 
           data?.fee_rs || 
           data?.fee_rs || 
           data?.permanent_dl_5_year || 
           data?.permanent_dl_3_year || 
           data?.amount || 
           0;
  };

  // Get appropriate color based on fee type or category
  const getColorForFee = (data) => {
    const category = data?.category?.toLowerCase() || data?.type?.toLowerCase() || '';
    const feeType = data?.fee_type?.toLowerCase() || '';
    
    if (category.includes('motorcycle') || category.includes('m/cycle')) return '#007AFF';
    if (category.includes('car') || category.includes('jeep')) return '#28a745';
    if (category.includes('ltv') || category.includes('htv')) return '#ffc107';
    if (category.includes('rickshaw')) return '#17a2b8';
    if (feeType.includes('renewal')) return '#fd7e14';
    if (feeType.includes('duplicate')) return '#6f42c1';
    return '#115740';
  };

  const amount = getFeeAmount(licenseFee.data);
  const currency = licenseFee.data?.currency || 'PKR';
  const validity = licenseFee.data?.validity_years || 'N/A';
  const licenseType = licenseFee.data?.category || licenseFee.data?.type || 'License';
  const color = getColorForFee(licenseFee.data);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header 
        username={user?.displayName} 
        navigation={navigation}
        pageTitle="License Fee Details"
      >
        {renderHeaderRight()}
      </Header>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{licenseFee.title}</Text>
          <Text style={styles.description}>{licenseFee.description}</Text>
        </View>

        {/* Fee Details Section */}
        <View style={styles.feeDetailsSection}>
          <Text style={styles.sectionTitle}>Fee Information</Text>
          
          <View style={styles.feeDetailCard}>
            <View style={[styles.amountContainer, { backgroundColor: color }]}>
              <Text style={styles.amountText}>
                {currency} {typeof amount === 'number' ? amount.toLocaleString() : amount}
              </Text>
              <Text style={styles.amountSubtext}>License Fee</Text>
            </View>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="business-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Authority</Text>
                  <Text style={styles.detailValue}>{licenseFee.data?.authority_name || 'Unknown Authority'}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="card-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{licenseType}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="folder-outline" size={20} color="#666" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Fee Type</Text>
                  <Text style={styles.detailValue}>{licenseFee.data?.fee_type?.replace('_', ' ') || 'Standard'}</Text>
                </View>
              </View>
              
              {licenseFee.data?.s_no && (
                <View style={styles.detailItem}>
                  <Ionicons name="list-outline" size={20} color="#666" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Serial No.</Text>
                    <Text style={styles.detailValue}>{licenseFee.data.s_no}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Requirements Section */}
        {licenseFee.data?.requirements && licenseFee.data.requirements.length > 0 && (
          <View style={styles.requirementsSection}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <View style={styles.requirementsList}>
              {licenseFee.data.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Fee Breakdown Section - Punjab Style */}
        {(licenseFee.data?.test_fee || licenseFee.data?.courier_fee || licenseFee.data?.fee_after_passing_test) && (
          <View style={styles.additionalChargesSection}>
            <Text style={styles.sectionTitle}>Fee Breakdown</Text>
            <View style={styles.chargesList}>
              {licenseFee.data.test_fee && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>Test Fee</Text>
                    <Text style={styles.chargeValue}>{currency} {licenseFee.data.test_fee.toLocaleString()}</Text>
                  </View>
                </View>
              )}
              {licenseFee.data.courier_fee && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>Courier Fee</Text>
                    <Text style={styles.chargeValue}>{currency} {licenseFee.data.courier_fee.toLocaleString()}</Text>
                  </View>
                </View>
              )}
              {licenseFee.data.fee_after_passing_test && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>Fee After Passing Test</Text>
                    <Text style={styles.chargeValue}>{currency} {licenseFee.data.fee_after_passing_test.toLocaleString()}</Text>
                  </View>
                </View>
              )}
              {licenseFee.data.fee_rs && (
                <View style={[styles.chargeItem, { borderTopWidth: 2, borderTopColor: color, paddingTop: 12, marginTop: 8 }]}>
                  <View style={styles.chargeInfo}>
                    <Text style={[styles.chargeLabel, { fontWeight: 'bold', color: color }]}>Total Fee</Text>
                    <Text style={[styles.chargeValue, { fontWeight: 'bold', color: color }]}>{currency} {licenseFee.data.fee_rs.toLocaleString()}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Sindh Style - Multiple Validity Options */}
        {(licenseFee.data?.permanent_dl_3_year || licenseFee.data?.permanent_dl_5_year) && (
          <View style={styles.additionalChargesSection}>
            <Text style={styles.sectionTitle}>License Options</Text>
            <View style={styles.chargesList}>
              {licenseFee.data.permanent_dl_3_year && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>3 Year Permanent License</Text>
                    <Text style={styles.chargeValue}>
                      {currency} {typeof licenseFee.data.permanent_dl_3_year === 'number' 
                        ? licenseFee.data.permanent_dl_3_year.toLocaleString() 
                        : licenseFee.data.permanent_dl_3_year}
                    </Text>
                  </View>
                </View>
              )}
              {licenseFee.data.permanent_dl_5_year && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>5 Year Permanent License</Text>
                    <Text style={styles.chargeValue}>
                      {currency} {typeof licenseFee.data.permanent_dl_5_year === 'number' 
                        ? licenseFee.data.permanent_dl_5_year.toLocaleString() 
                        : licenseFee.data.permanent_dl_5_year}
                    </Text>
                  </View>
                </View>
              )}
              {licenseFee.data.new_learner_license_fee && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>New Learner License</Text>
                    <Text style={styles.chargeValue}>{currency} {licenseFee.data.new_learner_license_fee.toLocaleString()}</Text>
                  </View>
                </View>
              )}
              {licenseFee.data.renewal_within_30_days_5_year && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>Renewal Within 30 Days (5 Year)</Text>
                    <Text style={styles.chargeValue}>{currency} {licenseFee.data.renewal_within_30_days_5_year.toLocaleString()}</Text>
                  </View>
                </View>
              )}
              {licenseFee.data.renewal_after_30_days_5_year && (
                <View style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>Renewal After 30 Days (5 Year)</Text>
                    <Text style={styles.chargeValue}>{currency} {licenseFee.data.renewal_after_30_days_5_year.toLocaleString()}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Additional Information */}
        {licenseFee.data?.fee_description && (
          <View style={styles.additionalChargesSection}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.descriptionText}>{licenseFee.data.fee_description}</Text>
          </View>
        )}

        {/* Legacy Additional Charges Section */}
        {licenseFee.data?.additional_charges && (
          <View style={styles.additionalChargesSection}>
            <Text style={styles.sectionTitle}>Additional Charges</Text>
            <View style={styles.chargesList}>
              {Object.entries(licenseFee.data.additional_charges).map(([key, value]) => (
                <View key={key} style={styles.chargeItem}>
                  <View style={styles.chargeInfo}>
                    <Text style={styles.chargeLabel}>
                      {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <Text style={styles.chargeValue}>{currency} {value.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rich Content Section */}
        {licenseFee.rich_content && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Detailed Information</Text>
            <View style={[styles.webViewContainer, { height: webViewHeight }]}>
              <WebView
                source={{ html: htmlTemplate }}
                style={[styles.webView, { height: webViewHeight }]}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                onMessage={(event) => {
                  const height = parseInt(event.nativeEvent.data);
                  if (height > 0 && height !== webViewHeight) {
                    setWebViewHeight(Math.max(height + 50, 300));
                  }
                }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={false}
              />
            </View>
          </View>
        )}

        {/* Tags Section */}
        {licenseFee.tags && licenseFee.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {licenseFee.tags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text style={styles.backButtonText}>Back to License Fees</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerButton: {
    padding: 8,
  },
  headerSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  feeDetailsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  feeDetailCard: {
    marginTop: 8,
  },
  amountContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  amountSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  contentSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  webViewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  webView: {
    backgroundColor: 'transparent',
  },
  tagsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '600',
  },
  actionSection: {
    marginTop: 8,
  },
  backButton: {
    backgroundColor: '#115740',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  requirementsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requirementsList: {
    marginTop: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  additionalChargesSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chargesList: {
    marginTop: 8,
  },
  chargeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chargeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chargeLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  chargeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#115740',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginTop: 8,
  },
});

export default LicenseFeeDetailScreen;
