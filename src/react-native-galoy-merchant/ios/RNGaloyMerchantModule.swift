//
//  RNGaloyMerchantModule.swift
//  RNGaloyMerchantModule
//
//  Copyright © 2022 Nick Theile. All rights reserved.
//

import Foundation

@objc(RNGaloyMerchantModule)
class RNGaloyMerchantModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
