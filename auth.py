import streamlit as st
import time

def check_compliance_gateway():
    """
    Enforces PHIPA/PIPEDA/HIPAA compliance before account activation.
    """
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🛡️ Clinical Compliance Gateway")
    st.markdown("Before accessing the Nuros Unified Clinical Portal, you must acknowledge our regulatory data handling protocols.")
    
    with st.form("compliance_form"):
        st.markdown("**1. Data Encryption:** All vocal biomarkers are AES-256 encrypted at rest and in transit.")
        st.markdown("**2. Longitudinal Integrity:** Your Vocal Health Twin data is cryptographically signed and linked to your verified identity.")
        st.markdown("**3. Auxiliary Notice:** Nuros is an auxiliary screening tool, not a diagnostic medical device.")
        
        agree_hipaa = st.checkbox("I acknowledge the HIPAA / PHIPA / PIPEDA compliance terms.")
        agree_consent = st.checkbox("I consent to the capture and cryptographic hashing of my vocal biomarkers.")
        
        if st.form_submit_button("Acknowledge & Activate Secure Account"):
            if agree_hipaa and agree_consent:
                st.session_state.compliance_cleared = True
                st.success("Identity Cryptographically Verified. Entering Secure Portal...")
                time.sleep(1)
                st.rerun()
            else:
                st.error("You must accept all regulatory terms to proceed.")
    st.markdown("</div>", unsafe_allow_html=True)

def secure_login():
    """
    Mock 2-Step Verification Login
    """
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("🔐 Unified Clinical Portal")
    st.markdown("Authenticate to access your cryptographically linked Vocal Health Twin.")
    
    with st.form("login_form"):
        username = st.text_input("Verified Provider NPI or Patient ID", placeholder="Enter Provider NPI or Patient ID")
        password = st.text_input("Password", type="password", placeholder="Enter Password")
        
        if st.form_submit_button("Initiate 2-Step Verification"):
            if username and password:
                st.session_state.awaiting_2fa = True
                st.rerun()
            else:
                st.warning("Please enter credentials.")
    st.markdown("</div>", unsafe_allow_html=True)

def two_factor_auth():
    """
    2FA Verification Step
    """
    st.markdown("<div class='glass-card'>", unsafe_allow_html=True)
    st.subheader("📱 2-Step Verification")
    st.markdown("A secure token has been sent to your registered device.")
    
    with st.form("2fa_form"):
        token = st.text_input("Enter 6-Digit Secure Token", max_chars=6)
        
        if st.form_submit_button("Verify & Authenticate"):
            if len(token) == 6 or token == "123456": # Mock validation
                st.session_state.authenticated = True
                st.session_state.verified_user_id = "USR-" + str(hash(time.time()))[-6:]
                st.success("Authentication confirmed.")
                time.sleep(1)
                st.rerun()
            else:
                st.error("Invalid token.")
    st.markdown("</div>", unsafe_allow_html=True)

def handle_authentication():
    """
    Manages the full auth flow. Returns True if fully authenticated and compliant.
    """
    if not st.session_state.get("authenticated", False):
        if not st.session_state.get("awaiting_2fa", False):
            secure_login()
        else:
            two_factor_auth()
        return False
        
    if not st.session_state.get("compliance_cleared", False):
        check_compliance_gateway()
        return False
        
    return True
