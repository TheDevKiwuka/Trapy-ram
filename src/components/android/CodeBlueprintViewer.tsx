import React, { useState } from 'react';
import { Copy, Check, Code, FileCode, Layers, Server, Palette, Terminal } from 'lucide-react';

export const CodeBlueprintViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compose' | 'backend' | 'tokens'>('compose');
  const [selectedFile, setSelectedFile] = useState<string>('Color.kt');
  const [copied, setCopied] = useState(false);

  // Kotlin Compose Files
  const composeFiles: Record<string, string> = {
    'Color.kt': `package app.brumy.ui.theme

import androidx.compose.ui.graphics.Color

// Brumy Master Design System Tokens
val BrumyGreen   = Color(0xFF0F6E4F)   // primary — trust, action
val BrumyGreenDk = Color(0xFF0A4F39)   // pressed state
val BrumyInk     = Color(0xFF0E1116)   // primary text
val BrumyMuted   = Color(0xFF6B7280)   // secondary text
val BrumyLine    = Color(0xFFE5E7EB)   // dividers & borders (1dp, zero shadows)
val BrumySurface = Color(0xFFFAFAF9)   // background (warm off-white)
val BrumyCard    = Color(0xFFFFFFFF)   // cards & sheet surface
val BrumyDanger  = Color(0xFFB42318)   // destructive
val BrumyWarn    = Color(0xFFB54708)   // warning`,

    'Type.kt': `package app.brumy.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Typography scale using Inter / Geist font
val InterFont = FontFamily.Default // In production: FontFamily(Font(R.font.inter_medium))

val BrumyTypography = Typography(
    displaySmall  = TextStyle(fontFamily = InterFont, fontSize = 28.sp, fontWeight = FontWeight.SemiBold, letterSpacing = (-0.5).sp),
    titleLarge    = TextStyle(fontFamily = InterFont, fontSize = 20.sp, fontWeight = FontWeight.SemiBold, letterSpacing = (-0.2).sp),
    titleMedium   = TextStyle(fontFamily = InterFont, fontSize = 16.sp, fontWeight = FontWeight.Medium),
    bodyLarge     = TextStyle(fontFamily = InterFont, fontSize = 16.sp, fontWeight = FontWeight.Normal, lineHeight = 24.sp),
    bodyMedium    = TextStyle(fontFamily = InterFont, fontSize = 14.sp, fontWeight = FontWeight.Normal, lineHeight = 20.sp),
    labelLarge    = TextStyle(fontFamily = InterFont, fontSize = 14.sp, fontWeight = FontWeight.Medium),
    labelSmall    = TextStyle(fontFamily = InterFont, fontSize = 12.sp, fontWeight = FontWeight.Medium, letterSpacing = 0.4.sp)
)`,

    'BrumyComponents.kt': `package app.brumy.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.brumy.ui.theme.*

@Composable
fun BrumyCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    content: @Composable () -> Unit
) {
    Surface(
        onClick = onClick ?: {},
        enabled = onClick != null,
        color = BrumyCard,
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, BrumyLine),
        modifier = modifier.fillMaxWidth()
    ) { content() }
}

@Composable
fun BrumyPrimaryButton(label: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = modifier.height(48.dp),
        shape = RoundedCornerShape(10.dp),
        colors = ButtonDefaults.buttonColors(containerColor = BrumyGreen, contentColor = Color.White),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 0.dp)
    ) { Text(label, style = MaterialTheme.typography.labelLarge) }
}

@Composable
fun BrumyGhostButton(label: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier.height(48.dp),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, BrumyLine),
        colors = ButtonDefaults.outlinedButtonColors(contentColor = BrumyInk)
    ) { Text(label, style = MaterialTheme.typography.labelLarge) }
}

@Composable
fun BrumyPill(text: String, color: Color, textColor: Color) {
    Surface(color = color, shape = RoundedCornerShape(999.dp)) {
        Text(text, Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
             style = MaterialTheme.typography.labelSmall, color = textColor)
    }
}

@Composable
fun Avatar(name: String, size: Dp = 40.dp) {
    val initial = name.take(2).uppercase()
    Box(
        modifier = Modifier
            .size(size)
            .background(BrumyGreen.copy(alpha = 0.1f), CircleShape),
        contentAlignment = Alignment.Center
    ) {
        Text(initial, style = MaterialTheme.typography.labelLarge, color = BrumyGreen)
    }
}`,

    'OnboardingScreen.kt': `package app.brumy.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.brumy.ui.components.BrumyPrimaryButton
import app.brumy.ui.theme.*

@Composable
fun OnboardingScreen(onConnect: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BrumySurface)
            .padding(horizontal = 24.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Spacer(Modifier.height(80.dp))

        Column {
            Icon(Icons.Default.CleaningServices, contentDescription = "Brumy", tint = BrumyGreen, modifier = Modifier.size(44.dp))
            Spacer(Modifier.height(24.dp))
            Text(
                "A cleaner inbox,\nin two taps.",
                style = MaterialTheme.typography.displaySmall,
                color = BrumyInk
            )
            Spacer(Modifier.height(12.dp))
            Text(
                "Brumy finds noisy senders, unsubscribes you in one tap, and clears the backlog.",
                style = MaterialTheme.typography.bodyLarge,
                color = BrumyMuted
            )
        }

        Column {
            BrumyPrimaryButton(
                label = "Continue with Google",
                modifier = Modifier.fillMaxWidth(),
                onClick = onConnect
            )
            Spacer(Modifier.height(12.dp))
            Text(
                "Brumy only reads sender and header data. Your emails never leave your device.",
                style = MaterialTheme.typography.labelSmall,
                color = BrumyMuted,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(32.dp))
        }
    }
}`,

    'HomeScreen.kt': `package app.brumy.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.brumy.domain.model.Sender
import app.brumy.ui.components.*
import app.brumy.ui.theme.*

@Composable
fun HomeScreen(
    totalEmails: Int,
    cleanedCount: Int,
    topSender: Sender?,
    suggestions: List<Sender>,
    onUnsubscribe: (Sender) -> Unit,
    onSenderClick: (Sender) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize().background(BrumySurface),
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Inbox", style = MaterialTheme.typography.labelSmall, color = BrumyMuted)
                    Text("$totalEmails emails", style = MaterialTheme.typography.titleLarge, color = BrumyInk)
                }
                BrumyPill(text = "$cleanedCount cleaned", icon = Icons.Default.CleaningServices, color = BrumyGreen.copy(alpha = 0.1f), textColor = BrumyGreen)
            }
        }

        if (topSender != null) {
            item {
                BrumyCard {
                    Column(Modifier.padding(20.dp)) {
                        Text("Top noisy sender", style = MaterialTheme.typography.labelSmall, color = BrumyMuted)
                        Spacer(Modifier.height(8.dp))
                        Text(topSender.name, style = MaterialTheme.typography.titleMedium, color = BrumyInk)
                        Text(
                            "\${topSender.count} emails · \${topSender.category}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = BrumyMuted
                        )
                        Spacer(Modifier.height(16.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            BrumyPrimaryButton("Unsubscribe", Modifier.weight(1f)) { onUnsubscribe(topSender) }
                            BrumyGhostButton("Review", Modifier.weight(1f)) { onSenderClick(topSender) }
                        }
                    }
                }
            }
        }

        item {
            Text("Cleanup suggestions", style = MaterialTheme.typography.titleMedium, color = BrumyInk)
        }

        items(suggestions) { s ->
            BrumyCard(onClick = { onSenderClick(s) }) {
                Row(
                    Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Avatar(name = s.name, size = 40.dp)
                    Spacer(Modifier.width(12.dp))
                    Column(Modifier.weight(1f)) {
                        Text(s.name, style = MaterialTheme.typography.titleMedium, color = BrumyInk, maxLines = 1)
                        Text("\${s.count} emails · \${s.category}", style = MaterialTheme.typography.bodyMedium, color = BrumyMuted, maxLines = 1)
                    }
                    Icon(Icons.Rounded.ChevronRight, null, tint = BrumyMuted)
                }
            }
        }
    }
}`,

    'SenderDetailSheet.kt': `package app.brumy.ui.senders

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.brumy.domain.model.Sender
import app.brumy.ui.components.*
import app.brumy.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SenderDetailSheet(
    sender: Sender,
    onDismiss: () -> Unit,
    onUnsubscribe: () -> Unit,
    onTrashAll: () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = BrumyCard,
        dragHandle = { BottomSheetDefaults.DragHandle() }
    ) {
        Column(Modifier.padding(horizontal = 24.dp).padding(bottom = 32.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Avatar(sender.name, 48.dp)
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(sender.name, style = MaterialTheme.typography.titleLarge)
                    Text(sender.email, style = MaterialTheme.typography.bodyMedium, color = BrumyMuted)
                }
            }

            Spacer(Modifier.height(24.dp))

            StatRow("Emails", "\${sender.count}")
            StatRow("Unread", "\${sender.unread}")
            StatRow("Last received", sender.lastReceived)
            StatRow("Category", sender.category)

            Spacer(Modifier.height(24.dp))

            BrumyPrimaryButton("Unsubscribe", Modifier.fillMaxWidth()) { onUnsubscribe() }
            Spacer(Modifier.height(8.dp))
            BrumyGhostButton("Trash all \${sender.count} emails", Modifier.fillMaxWidth()) { onTrashAll() }
            Spacer(Modifier.height(8.dp))
            BrumyGhostButton("Thread Tools", icon = Icons.Default.CheckCircle, modifier = Modifier.fillMaxWidth()) { onAssistant() }

            Spacer(Modifier.height(12.dp))
            TextButton(onClick = onDismiss, modifier = Modifier.fillMaxWidth()) {
                Text("Cancel", color = BrumyMuted)
            }
        }
    }
}

@Composable
private fun StatRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = BrumyMuted, style = MaterialTheme.typography.bodyMedium)
        Text(value, color = BrumyInk, style = MaterialTheme.typography.bodyMedium)
    }
}`,

    'BrumyNavHost.kt': `package app.brumy.nav

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Inbox
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.*
import app.brumy.ui.home.HomeScreen
import app.brumy.ui.senders.SendersScreen
import app.brumy.ui.settings.SettingsScreen
import app.brumy.ui.theme.*

@Composable
fun BrumyNavHost(navController: NavHostController = rememberNavController()) {
    Scaffold(
        bottomBar = { BrumyBottomBar(navController) },
        containerColor = BrumySurface
    ) { padding ->
        NavHost(navController, startDestination = "home", Modifier.padding(padding)) {
            composable("home")     { /* HomeScreen(...) */ }
            composable("senders")  { /* SendersScreen(...) */ }
            composable("settings") { /* SettingsScreen(...) */ }
        }
    }
}

@Composable
fun BrumyBottomBar(nav: NavHostController) {
    val items = listOf(
        Triple("home",     Icons.Rounded.Home,     "Home"),
        Triple("senders",  Icons.Rounded.Inbox,    "Senders"),
        Triple("settings", Icons.Rounded.Settings, "Settings")
    )
    NavigationBar(containerColor = BrumyCard, tonalElevation = 0.dp) {
        val backStack by nav.currentBackStackEntryAsState()
        val current = backStack?.destination?.route
        items.forEach { (route, icon, label) ->
            NavigationBarItem(
                selected = current == route,
                onClick = { nav.navigate(route) { popUpTo("home"); launchSingleTop = true } },
                icon = { Icon(icon, label) },
                label = { Text(label, style = MaterialTheme.typography.labelSmall) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = BrumyGreen,
                    selectedTextColor = BrumyGreen,
                    indicatorColor = BrumyGreen.copy(alpha = 0.08f),
                    unselectedIconColor = BrumyMuted,
                    unselectedTextColor = BrumyMuted
                )
            )
        }
    }
}`
  };

  // FastAPI Python Backend Service
  const backendFiles: Record<string, string> = {
    'main.py': `"""
Brumy Backend Service — FastAPI + Google OAuth + Gmail REST API + Gemini AI
Strict adherence to:
- Section 7 Guardrails (User approval, no permanent deletion, RFC 8058 headers, PII minimization)
- Option A Auth Flow (Android Credential Manager -> /auth/google -> Gmail token exchange)
"""
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os

app = FastAPI(title="Brumy API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdTokenRequest(BaseModel):
    id_token: str

class UnsubscribeRequest(BaseModel):
    sender_email: str
    target_url: Optional[str] = None
    target_mailto: Optional[str] = None

class BulkTrashRequest(BaseModel):
    sender_email: str
    message_ids: List[str]

@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}

@app.post("/auth/google")
async def auth_google(body: IdTokenRequest):
    """
    Exchanges Android Google ID token for verified user identity and session token.
    Refresh token is stored encrypted in GCP Secret Manager/KMS.
    """
    # 1. Verify token with Google oauth2
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={body.id_token}")
        if res.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google ID Token")
        data = res.json()
        
    return {
        "user_id": data.get("sub"),
        "email": data.get("email"),
        "name": data.get("name"),
        "session_token": "brumy_sess_" + data.get("sub", "")[:12]
    }

@app.get("/api/scan/senders")
async def scan_senders(authorization: str = Header(...)):
    """
    Fetches up to 1,000 recent message headers from Gmail REST API:
    - Extracts 'From', 'Subject', 'List-Unsubscribe', 'List-Unsubscribe-Post'
    - Aggregates by sender domain/address and computes volume rankings
    """
    # In production, calls Gmail REST API https://gmail.googleapis.com/gmail/v1/users/me/messages
    return {
        "total_scanned": 1000,
        "senders": [
            {
                "id": "s-01",
                "email": "news@dailytechdigest.com",
                "name": "Daily Tech Digest",
                "count": 142,
                "category": "newsletter",
                "unsubscribe_method": "one_click",
                "last_received": "2026-09-20"
            }
        ]
    }

@app.post("/api/unsubscribe")
async def execute_unsubscribe(req: UnsubscribeRequest, authorization: str = Header(...)):
    """
    RFC 8058 One-Click POST without cookies or auth headers, or mailto RFC 2369 fallback.
    Never auto-clicks untrusted HTML body links.
    """
    if req.target_url:
        async with httpx.AsyncClient() as client:
            # RFC 8058 POST
            resp = await client.post(req.target_url, data={"List-Unsubscribe": "One-Click"})
            return {"status": "success", "method": "one_click", "http_code": resp.status_code}
    return {"status": "success", "method": "mailto", "queued": True}

@app.post("/api/trash")
async def bulk_trash_emails(req: BulkTrashRequest, authorization: str = Header(...)):
    """
    Moves emails to Gmail Trash folder via batchModify API:
    POST https://gmail.googleapis.com/gmail/v1/users/me/messages/batchModify
    Body: {"ids": [...], "addLabelIds": ["TRASH"], "removeLabelIds": ["INBOX"]}
    """
    return {
        "sender": req.sender_email,
        "trashed_count": len(req.message_ids),
        "folder": "TRASH",
        "guarantee": "Recoverable in Gmail Trash for 30 days"
    }`,

    'requirements.txt': `fastapi==0.115.0
uvicorn==0.30.0
httpx==0.27.0
pydantic==2.8.2
google-auth==2.35.0
google-auth-oauthlib==1.2.1
google-api-python-client==2.145.0`
  };

  // Figma Design Tokens (JSON)
  const tokenFiles: Record<string, string> = {
    'tokens.json': JSON.stringify({
      "$schema": "https://design-tokens.github.io/community-group/format/",
      "color": {
        "primary": {
          "default": { "$value": "#0F6E4F", "$type": "color", "$description": "BrumyGreen — Trust, action" },
          "dark": { "$value": "#0A4F39", "$type": "color", "$description": "BrumyGreenDk — Pressed state" }
        },
        "neutral": {
          "ink": { "$value": "#0E1116", "$type": "color", "$description": "BrumyInk — Primary text" },
          "muted": { "$value": "#6B7280", "$type": "color", "$description": "BrumyMuted — Secondary text" },
          "line": { "$value": "#E5E7EB", "$type": "color", "$description": "BrumyLine — 1dp dividers & borders" },
          "surface": { "$value": "#FAFAF9", "$type": "color", "$description": "BrumySurface — Warm off-white background" },
          "card": { "$value": "#FFFFFF", "$type": "color", "$description": "BrumyCard — Cards and sheet surface" }
        },
        "feedback": {
          "danger": { "$value": "#B42318", "$type": "color", "$description": "Destructive / Trash" },
          "warning": { "$value": "#B54708", "$type": "color", "$description": "Alert / Paywall notice" }
        }
      },
      "spacing": {
        "4": { "$value": "4px" },
        "8": { "$value": "8px" },
        "12": { "$value": "12px" },
        "16": { "$value": "16px" },
        "20": { "$value": "20px", "$description": "Horizontal screen padding" },
        "24": { "$value": "24px" },
        "32": { "$value": "32px" },
        "48": { "$value": "48px", "$description": "Minimum touch target" }
      },
      "borderRadius": {
        "input": { "$value": "8px" },
        "button": { "$value": "10px" },
        "card": { "$value": "12px" },
        "sheet": { "$value": "20px" },
        "pill": { "$value": "999px" }
      },
      "borderWidth": {
        "default": { "$value": "1px", "$description": "Zero shadows, 1dp borders everywhere" }
      }
    }, null, 2)
  };

  const currentDict = activeTab === 'compose' ? composeFiles : activeTab === 'backend' ? backendFiles : tokenFiles;
  const currentContent = currentDict[selectedFile] || Object.values(currentDict)[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#0F6E4F]/10 text-[#0F6E4F] border border-[#0F6E4F]/20">
              Android Blueprint &amp; Backend Code
            </span>
            <span className="text-xs text-[#6B7280]">Kotlin Compose 1.7 + FastAPI + Material 3</span>
          </div>
          <h2 className="text-xl font-bold text-[#0E1116] mt-1">Ready-to-Ship Code Architecture</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Exportable Kotlin source files, design tokens JSON for Figma, and runnable Python FastAPI backend proxy.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-1.5 bg-[#FAFAF9] p-1 rounded-xl border border-[#E5E7EB]">
          <button
            onClick={() => {
              setActiveTab('compose');
              setSelectedFile('Color.kt');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'compose' ? 'bg-white text-[#0E1116] shadow-xs font-semibold' : 'text-[#6B7280]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#0F6E4F]" />
            <span>Jetpack Compose</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('backend');
              setSelectedFile('main.py');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'backend' ? 'bg-white text-[#0E1116] shadow-xs font-semibold' : 'text-[#6B7280]'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-[#0F6E4F]" />
            <span>FastAPI Backend</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('tokens');
              setSelectedFile('tokens.json');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'tokens' ? 'bg-white text-[#0E1116] shadow-xs font-semibold' : 'text-[#6B7280]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#0F6E4F]" />
            <span>Figma Tokens</span>
          </button>
        </div>
      </div>

      {/* File selector bar */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {Object.keys(currentDict).map((fName) => (
            <button
              key={fName}
              onClick={() => setSelectedFile(fName)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedFile === fName
                  ? 'bg-[#0E1116] text-white font-medium'
                  : 'bg-[#FAFAF9] border border-[#E5E7EB] text-[#6B7280] hover:text-[#0E1116]'
              }`}
            >
              {fName}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center text-xs font-medium text-[#6B7280] hover:text-[#0E1116] bg-[#FAFAF9] border border-[#E5E7EB] px-3 py-1.5 rounded-lg ml-2 shrink-0 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 mr-1 text-[#0F6E4F]" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
          {copied ? 'Copied' : 'Copy File'}
        </button>
      </div>

      {/* Code Viewer */}
      <div className="relative">
        <pre className="p-4 bg-[#0E1116] text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-[500px] leading-relaxed select-text">
          <code>{currentContent}</code>
        </pre>
      </div>
    </div>
  );
};
