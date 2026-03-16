package com.apkurl.blocker

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.apkurl.blocker.ui.theme.APKURLBlockerTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            APKURLBlockerTheme {
                val navController = rememberNavController()
                
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") { HomeScreen(navController) }
                        composable("url_scan") { UrlScanScreen(navController) }
                        composable("apk_scan") { ApkScanScreen(navController) }
                        composable("history") { HistoryScreen(navController) }
                        composable("result/{scanId}") { backStackEntry ->
                            val scanId = backStackEntry.arguments?.getString("scanId")
                            ResultScreen(navController, scanId)
                        }
                    }
                }
            }
        }
    }
}

// Note: HomeScreen, UrlScanScreen, etc. would be defined in separate files 
// following the Jetpack Compose patterns mapped from your React prototype.
